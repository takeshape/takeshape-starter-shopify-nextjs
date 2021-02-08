import Error from "next/error";
import TakeShape from "../../takeshape.client";
import styles from "../../styles/Product.module.css";
import AddToCart from "../../components/AddToCart";
import { squashProduct } from "..";

const Product = (product) => {
  product = squashProduct(product);
  return (
    <div className={styles.container}>
      {product.image && (
        <div className={styles.image}>
          <img src={product.image} />
        </div>
      )}
      <div className={styles.text}>
        <h2>{product.name}</h2>
        <p>${product.price}</p>
        <AddToCart products={[product]} />
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
          _id
          name
          productId: takeshapeIoShopId
          product: takeshapeIoShop {
            title
            descriptionHtml
            images(first: 1) {
              edges {
                node {
                  transformedSrc(crop: CENTER, maxHeight: 1200, maxWidth: 800)
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  price
                  storefrontId
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
