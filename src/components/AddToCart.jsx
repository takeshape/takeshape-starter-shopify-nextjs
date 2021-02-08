import AppContext from '../context/AppContext'
import styles from "../styles/AddToCart.module.css";
import { useContext } from "react";

function addToCart(products, quantity, shopify, checkoutId, setCartSize) {

  const lineItemsToAdd = products.map(product => ({
    variantId: product.storefrontId,
    quantity
  }));
  
  shopify.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
    setCartSize(checkout.lineItems.length)

    if (products.length === 1) {
      alert(`Added ${products[0].name} to the cart!`);
    } else {
      alert(
        `Added ${products.length} products (${products.map(product => product.name).join(", ")}) to the cart!`
      );
    }
  });
}

const AddToCart = ({ products, label = "Add to cart"}) => {
  const { shopify, checkoutId, setCartSize } = useContext(AppContext);

  const onClickHandler = () => addToCart(products, 1, shopify, checkoutId, setCartSize);
  return (
    <button className={styles.button} onClick={onClickHandler}>
      {label}
    </button>
  );
};

export default AddToCart;
