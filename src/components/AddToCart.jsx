import React, { useContext } from "react";
import CartContext from '../context/CartContext'

function addToCart(products, quantity, shopify, checkoutId, setCart) {

  const lineItemsToAdd = products.map(product => ({
    variantId: product.storefrontId,
    quantity
  }));
  
  shopify.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
    setCart(checkout.lineItems)
  });
}

const AddToCart = ({ products, label = "Add to cart"}) => {
  const { shopify, checkoutId, setCart } = useContext(CartContext);

  const onClickHandler = () => addToCart(products, 1, shopify, checkoutId, setCart);
  return (
    <button className="button" onClick={onClickHandler}>
      {label}
    </button>
  );
};

export default AddToCart;
