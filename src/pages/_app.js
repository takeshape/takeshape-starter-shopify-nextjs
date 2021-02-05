import Link from "next/link";
import "../styles/globals.css";
import styles from "../styles/App.module.css";
import Banner from "../components/Banner";
import Client from 'shopify-buy';
import { useState, useEffect } from "react";

const Header = ({checkoutUrl, cartSize}) => {
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
      domain: 'takeshape-io-shop.myshopify.com',
      storefrontAccessToken: 'd18c85d432999a11b615fe285aaaef4b'
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
    content = <Component shopify={shopify} checkoutId={checkoutId} setCartSize={setCartSize} {...pageProps} />;
  }

  return (
    <>
      <Banner />
      <Header checkoutUrl={checkoutUrl} cartSize={cartSize} />
      {content}
    </>
  );
}

export default MyApp;
