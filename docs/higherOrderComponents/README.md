# Higher-Order Components

[Higher-order components](https://reactjs.org/docs/higher-order-components.html) are a common React abstraction pattern. A higher-order component, or HOC, is nothing more than a function that takes a component as an argument and returns a component that composes the component passed in with some other component(s) (i.e., it wraps the component passed in in some parent component(s)). The returned component can then be used like any other React component.

One example of an HOC is the `withModal` function in SIM, which takes a component as its argument and returns that same component wrapped in a modal:
```js
const withModal = WrappedComponent => (
  ({ title, subtitle, ...wrappedComponentProps }) => (
    <Modal title={title} subtitle={subtitle}>
      <WrappedComponent {...wrappedComponentProps} />
    </Modal>
  )
)
```
You can then use this component like any other:
```js
const EditFormModal = withModal(ShoppingListItemEditForm)

return(
  <>
    {modalVisible && <EditFormModal title='Edit List Item' {...modalAttributes.props} />}
    ...
  <>
)
```

Currently, SIM only has one HOC, [`withModal`](/docs/higherOrderComponents/withModal.md).
