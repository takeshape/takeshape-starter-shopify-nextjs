import Link from "next/link";
import { getImageUrl } from "@takeshape/routing";
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

const ProductCard = ({ _id, name, image, productId, product }) => {
  const { title } = product;
  const price = getProductPrice(product);
  return (
    <div className={styles.container}>
      {image && (
        <ProductLink id={_id}>
          <img
            className={styles.image}
            src={getImageUrl(image.path, { w: 300, h: 300, fit: "crop" })}
          />
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
