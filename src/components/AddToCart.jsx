import React, { useContext, useCallback, useMemo } from "react";
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
  const isDisabled = useMemo(() => shopify === null || checkoutId === null, [shopify, checkoutId]);
  const onClickHandler = useCallback(() => {
    if (!isDisabled) {
      addToCart(products, 1, shopify, checkoutId, setCart)
    }
  }, [products, isDisabled, shopify, checkoutId, setCart]);
  return (
    <button disabled={isDisabled} className="button" onClick={onClickHandler}>
      {label}
    </button>
  );
};

export default AddToCart;
