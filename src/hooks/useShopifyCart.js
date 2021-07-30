import Client from 'shopify-buy';
import { useState, useEffect, useCallback } from "react";

function getTotalQuantity(lineItems) {
  return lineItems.reduce((total, item) => total + item.quantity, 0)
}

async function getOrCreateCheckout(client, initCheckout) {
  const existingCheckoutId = localStorage.getItem('shopifyCheckoutId');
  let checkout = await client.checkout.fetch(existingCheckoutId);
  if (!existingCheckoutId || !checkout) {
    checkout = await client.checkout.create();
  }
  initCheckout(checkout);
}

export default function useShopifyCart() {
  const [shopify, setShopify] = useState(null);
  const [checkoutId, setCheckoutId] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [cartSize, setCartSize] = useState(null);
  const [lineItems, setLineItems] = useState(null);

  const setCart = useCallback((lineItems) => {
    setCartSize(getTotalQuantity(lineItems));
    setLineItems(lineItems);
  });

  const removeLineItem = useCallback((lineItem) => {
    shopify.checkout.removeLineItems(checkoutId, [lineItem.id]).then((checkout) => {
      setCart(checkout.lineItems);
    });
  });

  const initCheckout = useCallback((checkout) => {
    try {
      localStorage.setItem('shopifyCheckoutId', checkout.id);
    } catch (e) {
      console.error('Could not set shopifyCheckoutId', e);
    }
    setCheckoutId(checkout.id);
    setCheckoutUrl(checkout.webUrl);
    setCart(checkout.lineItems);
  }, [setCheckoutId, setCheckoutUrl, setCart]);

  // Fetch or create checkout
  useEffect(() => {
    const client = Client.buildClient({
      domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
      storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    });
    setShopify(client);
    getOrCreateCheckout(client, initCheckout);
  }, []);

  return {shopify, checkoutId, checkoutUrl, cartSize, setCart, lineItems, removeLineItem}
}
