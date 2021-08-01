# withModal

The `withModal` HOC enables modal content to be dynamically set. This combines with the `setModalAttributes` function defined in the `AppContext` to enable the modal content to change as needed, without rendering multiple modals in a view.

The `withModal` function takes a component as its argument and returns the component wrapped in a modal. The component returned takes any props of the wrapped component as well as the `title` and `subtitle` props for the modal itself.

Here is an example of using `withModal`. This code will set the modal component to contain a `ModalGameForm`. Then, the `setModalVisible` function is used to display the modal with those attributes:

```js
const { setModalAttributes, setModalVisible } = useAppContext()

const displayModalEditForm = () => {
  const Tag = withModal(ModalGameForm)

  setModalAttributes({
    Tag,
    props: {
      // These are the props for the modal itself
      title: 'Edit Game',
      subtitle: `Editing game "${game.name}"`,

      // These are the props for the wrapped
      // component
      type: 'edit',
      currentAttributes: {
        name: 'Current name',
        description: 'Current description'
      }
    }
  })

  setModalVisible(true)
}
```
Note that, in order for this to work, the component has to actually be rendered on the page as well:
```js
const { modalVisible, modalAttributes } = useAppContext()

return(
  modalVisible && <modalAttributes.tag {...modalAttributes.props} />
)
```
