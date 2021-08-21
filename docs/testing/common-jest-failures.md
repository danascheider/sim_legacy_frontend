# Common Jest Failures and How to Fix Them

There are several common errors in Jest that often come up as you're writing new tests. This document describes some of the most common Jest failures, what they mean, and how to fix them.

* [Can't Perform a React State Update on an Unmounted Component](#cant-perform-a-react-state-update-on-an-unmounted-component)
* [Failure Says Element Doesn't Appear and Shows an Empty Body](#failure-says-element-doesnt-appear-and-shows-an-empty-body)
* [Tests Fail when Preceded by Other Tests with Form Events](#tests-fail-when-preceded-by-other-tests-with-form-events)
* [Network Request Failed](#network-request-failed)
* [MSW Says Preflight (CORS) OPTIONS Request Is Unhandled](#msw-says-preflight-cors-options-request-is-unhandled)

## Can't Perform a React State Update on an Unmounted Component

If you see this warning, it's likely that something about your test unrelated to unmounted components is broken. This warning is very common and when it comes up, it is worth seeing if there is an actual memory leak that could occur in production or if there is something else wrong with the test.

### When Tests Are Failing

This warning can occur on passing tests so if you see this warning on a failing test, first focus on fixing anything else that could be breaking the test. This is especially true if you see this in conjunction with other common errors, such as [MSW's preflight OPTIONS request](/#msw-says-preflight-cors-options-request-is-unhandled) issue. If the memory leak is real and likely to occur in production, you will continue to see this warning when the test is passing.

### When Tests Are Passing

You may see this warning when tests are passing. If this is the case, you should treat the warning as legitimate and patch the memory leak. The leak happens when components are removed from the view before they finish their asynchronous function calls or tasks. For example, a context provider might run a `useEffect` hook that makes an API call and sets state right before being unmounted, such that the API call's handlers have not yet completed when the provider is unmounted. As a consequence, the state update function `setWhatever` is being called after the component is unmounted. The warning indicates you should "cancel all subscriptions and asynchronous tasks in a useEffect cleanup function". This section shows you how to do that.

To troubleshoot this warning, you first need to identify which component is causing the problem. There will usually be some kind of trace indicating which component this is, but if not, you can identify it by the following rules of thumb:

* Context providers have historically the biggest offenders in SIM. If you are seeing warnings about state updates on unmounted components and there is no trace, check your context providers before anything else.
* The next place to look is in any component, including pages and layouts, that will disappear from the page during the course of the test.

Once you've identified the offending component or at least developed a hypothesis as to which one it is, you can proceed with the next steps.

#### Use a Ref to Store Mounted State

First, you will need a way for your component to know when it is mounted and when it isn't, and to only perform state updates when it is mounted. The way to do this is a ref and a `useEffect` cleanup function:

```js
import React, { useState, useEffect, useRef } from 'react'

const YourComponent = ({ value }) => {
  const [someState, setSomeState] = useState(value)

  const mountedRef = useRef(true)

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <div className={styles.root}>{/* other stuff */}</div>
  )
}
```
Note the empty dependency array on the `useEffect` hook. This is critical. This ensures that the `useEffect` hook is only run once, when the component is mounted. Therefore, the cleanup function will only run when it is unmounted. If you include other dependencies, the component will be "unmounted" every time they are changed, and the ref will not be set to `true` again until the component is actually unmounted and re-mounted--i.e., when this instance's life cycle has ended.

#### Unmount the Component

In addition to the above, you should also unmount the component at any point you know it will disappear. In this example, assume the component will be removed after the data object it renders is deleted.
```js
import React, { useState, useEffect, useRef } from 'react'
import { useSomeContext } from '../../hooks/contexts'

const YourComponent = () => {
  const { dataObject, performDataObjectDestroy } = useSomeContext()

  const [someState, setSomeState] = useState(dataObject || null)

  const mountedRef = useRef(true)

  const deleteObject = () => {
    performDataObjectDestroy(dataObject.id, {
      onSuccess: () => mountedRef.current = false
    })
  }

  // You still need this
  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <div className={styles.root}>
      <button className={styles.button} onClick={deleteObject}>
        Delete Object
      </button>
    </div>
  )
}
```
Then, in your context provider, define the function `destroyDataObject` to take a `callbacks` object. (It is recommended to use a `callbacks` object instead of positional arguments with functions since this function's outcome will depend on the result of an API call and you may end up wanting different behaviour for each possible response status.)
```js
import React, { createContext, useRef, useState, useEffect, useCallback } from 'react'
import { destroyDataObject, fetchDataObject } from '../../utils/simApi'

const SomeContext = createContext()

const SomeProvider = ({ children }) => {
  const [dataObject, setDataObject] = useState(null)

  const mountedRef = useRef(true)

  const fetchObject = useCallback(() => {
    if (!mountedRef.current) return

    fetchDataObject()
      .then(resp => resp.json())
      .then(data => setDataObject(data))
  }, [fetchDataObject])

  const performDataObjectDestroy = (objectId, callbacks = {}) => {
    // If you don't do this and the component has been unmounted,
    // `setDataObject` will be called on the unmounted component,
    // leading to the warning.
    if (!mountedRef.current) return

    destroyDataObject(objectId)
      .then(resp => resp.json())
      .then(data => {
        setDataObject(data)

        callbacks.onSuccess && callbacks.onSuccess()
      })
  }

  const value = { dataObject, performDataObjectDestroy }

  // The context provider will fetch the data object when
  // the provider mounts and again any time the fetchObject
  // function changes, which is by default on each render.
  useEffect(() => {
    fetchObject()
  }, [fetchObject])

  // You have to do this in the context provider too
  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <SomeContext.Provider value={value}>
      {children}
    </SomeContext.Provider>
  )
}

export { SomeContext, SomeProvider }
```
This way, the `onSuccess` callback will run after the API call is completed, unmounting the removed instance of `YourComponent`.

## Failure Says Element Doesn't Appear and Shows Empty Body

Sometimes, you'll see a message that an element you expected to be visible isn't visible and you will see in its output that there is an empty `body`, or a `body` with just an empty `div` inside:
```html
<body>
  <div />
</body>
```

This is generally caused by the execution of some request going off the rails. Put debug statements throughout the code to see how far along in the execution it gets before it fails or diverges from what it was meant to do, and to inspect values. Eventually you'll see where it's broken and it's often a small fix.

## Tests Fail when Preceded by Other Tests with Form Events

Another common error is that, when you have a test that interacts with a form, especially one that calls `fireEvent.submit(form)`, the tests following that one in the same file will experience expectation failures. A little digging reveals that these failures are caused by state leakage between test renders. This happens even when `component.unmount()` is called after each test.

There are some [known issues](https://github.com/testing-library/react-testing-library/issues/716) with React testing library that cause tests to become order-dependent in this way. The testing library maintainers have not yet figured out exactly what the problem is. There have been some other occurrences of the problem involving lazy loading and [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html), which led maintainers to speculate that this could be the problem, however in this code base it has shown a clear pattern of coming after form events, primarily submits, in previous tests within the same file.

Unfortunately, the only known workaround at this point is to separate affected tests into separate files, or remove them. Separating them is the preferred choice for this project and is a good idea when you have multiple tests with form submit events in them, even if they are passing, since we know state leakage and order dependence are possible in this situation. This could lead to false passes as well as false failures.

## Network Request Failed

This error typically means that there is some kind of error in one of your MSW request handlers, use of an undeclared variable, for example. Errors in MSW handlers don't seem to raise what you could consider "meaningful" errors but always indicate `Network Request Failed` when there is any syntax error or similar issue in the handler.

## MSW Says Preflight (CORS) OPTIONS Request Is Unhandled

I don't remember how I've solved this problem. The most recent instance of it turned out to be
 because there actually was a request without a handler.
