import Link from "next/link";
import "../styles/globals.css";
import styles from "../styles/App.module.css";
import Banner from "../components/Banner";
import Cart from '../components/Cart';
import CartContext from '../context/CartContext';
import Client from 'shopify-buy';
import { useState, useEffect, useCallback } from "react";

function getTotalQuantity(lineItems) {
  return lineItems.reduce((total, item) => total + item.quantity, 0)
}

const Header = () => {
  return <header className={styles.header}>
    <Link href='/'>
      <a className={styles.appName}>Lookbook</a>
    </Link>
    <Cart />
  </header>
};


function initCheckout(checkout, setCheckoutId, setCheckoutUrl, setCart) {
  try {
    localStorage.setItem('shopifyCheckoutId', checkout.id);
  } catch (e) {
    console.error('Could not set shopifyCheckoutId', e);
  }
  setCheckoutId(checkout.id);
  setCheckoutUrl(checkout.webUrl);
  setCart(checkout.lineItems);
}

function MyApp({ Component, pageProps }) {

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

  // Fetch or create checkout
  useEffect(() => {
    const client = Client.buildClient({
      domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
      storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    });
    setShopify(client);

    const existingCheckoutId = localStorage.getItem('shopifyCheckoutId');

    if (existingCheckoutId) {
      client.checkout.fetch(existingCheckoutId).then(checkout => {
        initCheckout(checkout, setCheckoutId, setCheckoutUrl, setCart);
      });
    } else {
      client.checkout.create().then(checkout => {
        initCheckout(checkout, setCheckoutId, setCheckoutUrl, setCart);
      });
    }
  }, []);

  let content;
  if (shopify === null || checkoutId === null) {
    content = null;
  } else {
    content = <Component {...pageProps} />;
  }

  return (
    <CartContext.Provider value={{shopify, checkoutId, checkoutUrl, cartSize, setCart, lineItems, removeLineItem}}>
      <Banner />
      <Header />
      {content}
    </CartContext.Provider>
  );
}

export default MyApp;
