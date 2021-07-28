import Link from "next/link";
import "../styles/globals.css";
import styles from "../styles/App.module.css";
import Banner from "../components/Banner";
import Cart from '../components/Cart';
import CartContext from '../context/CartContext';
import useShopifyCart from '../hooks/useShopifyCart';

const Header = () => {
  return <header className={styles.header}>
    <Link href='/'>
      <a className={styles.appName}>Lookbook</a>
    </Link>
    <Cart />
  </header>
};

function MyApp({ Component, pageProps }) {
  const shopifyCart = useShopifyCart();
  return (
    <CartContext.Provider value={shopifyCart}>
      <Banner />
      <Header />
      <Component {...pageProps} />
    </CartContext.Provider>
  );
}

export default MyApp;
