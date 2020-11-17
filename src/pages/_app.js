import Link from "next/link";
import "../styles/globals.css";
import styles from "../styles/App.module.css";
import Banner from "../components/Banner";

const Header = () => (
  <header className={styles.header}>
    <Link href='/'>
      <a className={styles.appName}>Lookbook</a>
    </Link>
  </header>
);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Banner />
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
