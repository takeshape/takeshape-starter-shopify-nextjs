import styles from "../styles/AddToCart.module.css";

function addToCart(products, quantity) {
  const productCount = products.length * quantity;
  alert(
    `Added ${productCount} product${
      productCount !== 1 ? "s" : ""
    } (${products.join(", ")}) to the cart!`
  );
}

const AddToCart = ({ products, label = "Add to cart" }) => {
  const onClickHandler = () => addToCart(products, 1);
  return (
    <button className={styles.button} onClick={onClickHandler}>
      {label}
    </button>
  );
};

export default AddToCart;
