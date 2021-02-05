import Link from "next/link";
import styles from "../styles/ProductCard.module.css";
import AddToCart from "./AddToCart";

const ProductLink = ({ id, children }) => (
  <Link href={`/products/${id}`}>
    <a className={styles.link}>{children}</a>
  </Link>
);

export function getProductVariant(product) {
  return {
    ...product.variants?.edges[0]?.node,
    title: product.title
  };
}

const ProductCard = ({ _id, product, shopify, checkoutId, setCartSize }) => {
  const { title } = product;
  const productVariant = getProductVariant(product);
  return (
    <div className={styles.container}>
      {productVariant.image && (
        <ProductLink id={_id}>
          <img className={styles.image} src={productVariant.image} />
        </ProductLink>
      )}
      <div className={styles.text}>
        <ProductLink id={_id}>
          <p className={styles.title}>{title}</p>
        </ProductLink>
        {productVariant.price && <p className={styles.price}>${productVariant.price}</p>}
        <AddToCart products={[productVariant]} shopify={shopify} checkoutId={checkoutId} setCartSize={setCartSize} />
      </div>
    </div>
  );
};

export default ProductCard;
