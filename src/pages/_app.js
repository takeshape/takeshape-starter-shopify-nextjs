import Link from "next/link";
import "../styles/globals.css";
import styles from "../styles/App.module.css";
import Banner from "../components/Banner";
import AppContext from '../context/AppContext';
import Client from 'shopify-buy';
import { useState, useEffect, useContext } from "react";

const Header = () => {
  const { checkoutUrl, cartSize } = useContext(AppContext);

  let cartText = null;
  if (cartSize < 1) {
    cartText = <span>No items in cart</span>
  } else {
    cartText = <span>{cartSize} {cartSize === 1 ? 'item' : 'items'} in cart{' '}</span>
  }

  let checkout = null;
  if (checkoutUrl !== null && cartSize !== null) {
    checkout = <span className={styles.checkout}>
        {cartText}
        {cartSize > 0 && <a className={styles.checkoutLink} href={checkoutUrl} target="_blank">Check Out</a>}
      </span>;
  }

  return <header className={styles.header}>
    <Link href='/'>
      <a className={styles.appName}>Lookbook</a>
    </Link>
    {' '}
    {checkout}
  </header>
};


function initCheckout(checkout, setCheckoutId, setCheckoutUrl, setCartSize) {
  try {
    localStorage.setItem('shopifyCheckoutId', checkout.id);
  } catch (e) {
    console.error('Could not set shopifyCheckoutId', e);
  }
  setCheckoutId(checkout.id);
  setCheckoutUrl(checkout.webUrl);
  setCartSize(checkout.lineItems.length);
}

function MyApp({ Component, pageProps }) {

  const [shopify, setShopify] = useState(null);
  const [checkoutId, setCheckoutId] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [cartSize, setCartSize] = useState(null);

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
        initCheckout(checkout, setCheckoutId, setCheckoutUrl, setCartSize);
      });
    } else {
      client.checkout.create().then(checkout => {
        initCheckout(checkout, setCheckoutId, setCheckoutUrl, setCartSize);
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
    <AppContext.Provider value={{shopify, checkoutId, checkoutUrl, cartSize, setCartSize}}>
      <Banner />
      <Header />
      {content}
    </AppContext.Provider>
  );
}

export default MyApp;
