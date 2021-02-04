import Link from "next/link";
import styles from "../styles/ProductCard.module.css";
import AddToCart from "./AddToCart";

const ProductLink = ({ id, children }) => (
  <Link href={`/products/${id}`}>
    <a className={styles.link}>{children}</a>
  </Link>
);

export function getProductPrice(product) {
  const { variants } = product;
  const firstNode = variants?.edges[0]?.node;
  const price = firstNode?.price;
  return price;
}

export function getProductImage(product) {
  const node = product.images?.edges[0]?.node
  return node?.transformedSrc || node?.originalSrc
}

const ProductCard = ({ _id, productId, product }) => {
  const { title } = product;
  const price = getProductPrice(product);
  const image = getProductImage(product);
  return (
    <div className={styles.container}>
      {image && (
        <ProductLink id={_id}>
          <img className={styles.image} src={image} />
        </ProductLink>
      )}
      <div className={styles.text}>
        <ProductLink id={_id}>
          <p className={styles.title}>{title}</p>
        </ProductLink>
        {price && <p className={styles.price}>${price}</p>}
        <AddToCart products={[productId]} />
      </div>
    </div>
  );
};

export default ProductCard;
