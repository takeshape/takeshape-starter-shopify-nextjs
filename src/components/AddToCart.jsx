import styles from "../styles/AddToCart.module.css";

function addToCart(products, quantity, shopify, checkoutId, setCartSize) {

  // TODO create this from the products arg after the storefront id is in the query
  const lineItemsToAdd = [
    {
      variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNzExMDI0NDIxMjkwMw==',
      quantity
    }
  ];
  
  shopify.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
    setCartSize(checkout.lineItems.length)

    if (products.length === 1) {
      alert(`Added ${products[0].title} to the cart!`);
    } else {
      alert(
        `Added ${products.length} products (${products.map(product => product.title).join(", ")}) to the cart!`
      );
    }
  });
}

const AddToCart = ({ products, label = "Add to cart", shopify, checkoutId, setCartSize }) => {
  const onClickHandler = () => addToCart(products, 1, shopify, checkoutId, setCartSize);
  return (
    <button className={styles.button} onClick={onClickHandler}>
      {label}
    </button>
  );
};

export default AddToCart;
