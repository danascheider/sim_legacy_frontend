# Common Jest Failures and How to Fix Them

There are several common errors in Jest that often come up as you're writing new tests. This document describes some of the most common Jest failures, what they mean, and how to fix them.

* [Can't Perform a React State Update on an Unmounted Component](#cant-perform-a-react-state-update-on-an-unmounted-component)
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

## MSW Says Preflight (CORS) OPTIONS Request Is Unhandled

I don't remember how I've solved this problem. The most recent instance of it turned out to be because there actually was a request without a handler.
