import React, { useContext } from "react";
import CartContext from '../context/CartContext'
import styles from "../styles/AddToCart.module.css";

function getTotalQuantity(lineItems) {
  return lineItems.reduce((total, item) => total + item.quantity, 0)
}

function addToCart(products, quantity, shopify, checkoutId, setCartSize) {

  const lineItemsToAdd = products.map(product => ({
    variantId: product.storefrontId,
    quantity
  }));
  
  shopify.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
    setCartSize(getTotalQuantity(checkout.lineItems))
  });
}

const AddToCart = ({ products, label = "Add to cart"}) => {
  const { shopify, checkoutId, setCartSize } = useContext(CartContext);

  const onClickHandler = () => addToCart(products, 1, shopify, checkoutId, setCartSize);
  return (
    <button className={styles.button} onClick={onClickHandler}>
      {label}
    </button>
  );
};

export default AddToCart;
