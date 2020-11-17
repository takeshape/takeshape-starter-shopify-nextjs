import Error from "next/error";
import TakeShape, { getImageUrl } from "../../takeshape.client";
import styles from "../../styles/Product.module.css";
import AddToCart from "../../components/AddToCart";
import { getProductPrice } from "../../components/ProductCard";

const Product = ({ image, product, productId }) => {
  const { title } = product;
  const price = getProductPrice(product);
  return (
    <div className={styles.container}>
      {image && (
        <div className={styles.image}>
          <img
            src={getImageUrl(image.path, { w: 800, h: 1200, fit: "crop" })}
          />
        </div>
      )}
      <div className={styles.text}>
        <h2>{title}</h2>
        <p>${price}</p>
        <AddToCart products={[productId]} />
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      </div>
    </div>
  );
};

export default function ProductPage(props) {
  const { data, errors } = props;
  if (errors) {
    return <Error statusCode={500} />;
  } else if (!data) {
    return <Error statusCode={404} />;
  }
  return <Product {...data.product} />;
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const res = { props: {} };
  try {
    const query = `
      query singleProduct($id: ID!) {
        product: getProduct(_id: $id) {
          image {
            path
            title
            description
          }
          productId: takeshapeIoShopId
          product: takeshapeIoShop {
            title
            descriptionHtml
            variants(first: 1) {
              edges {
                node {
                  price
                }
              }
            }
          }
        }
      }
    `;
    const variables = { id };
    const data = await TakeShape.graphql(query, variables);
    res.props = data;
    return res;
  } catch (error) {
    console.error(error);
  }
  return res;
}

export async function getStaticPaths() {
  let paths = [];
  try {
    const query = `
      query {
        products: getProductList {
          items {
            _id
          }
        }
      }
    `;
    const res = await TakeShape.graphql(query);
    const createPath = (item) => ({ params: { id: item._id } });
    paths = res.data.products.items.map(createPath);
  } catch (error) {
    console.error(error);
  }
  return { paths, fallback: true };
}
