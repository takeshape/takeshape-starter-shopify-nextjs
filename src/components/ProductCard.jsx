import Link from "next/link";
import styles from "../styles/ProductCard.module.css";
import AddToCart from "./AddToCart";

const ProductLink = ({ id, children }) => (
  <Link href={`/products/${id}`}>
    <a className={styles.link}>{children}</a>
  </Link>
);

const ProductCard = (product) => {
  return (
    <div className={styles.container}>
      {product.image && (
        <ProductLink id={product._id}>
          <img className={styles.image} src={product.image} />
        </ProductLink>
      )}
      <div className={styles.text}>
        <ProductLink id={product._id}>
          <p className={styles.title}>{product.name}</p>
        </ProductLink>
        {product.price && <p className={styles.price}>${product.price}</p>}
        <AddToCart products={[product]} />
      </div>
    </div>
  );
};

export default ProductCard;
