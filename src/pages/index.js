import Error from "next/error";
import TakeShape, { gql, getImageUrl } from "../takeshape.client";
import styles from "../styles/Home.module.css";
import ProductCard from "../components/ProductCard";
import AddToCart from "../components/AddToCart";

// Flatten product, image, and variant info into one useful object
export function squashProduct(product) {
  const imageNode = product.product.images?.edges[0]?.node;
  return {
    ...product.product,
    ...product.product.variants?.edges[0]?.node,
    image: imageNode?.transformedSrc || imageNode?.originalSrc,
    ...product
  };
}

const Look = ({ photo, text, products }) => {
  products = products.map(squashProduct);
  return (
    <div className={styles.look}>
      <div className={styles.photo}>
        <img src={getImageUrl(photo.path, { w: 900, h: 1200, fit: "crop" })} />
      </div>
      <div className={styles.details}>
        <div className={styles.text} dangerouslySetInnerHTML={{__html: text}} />
        <div className={styles.products}>
          {products.map((product) => (
            <ProductCard {...product} key={product._id} />
          ))}
          <AddToCart
            label='Add all to cart'
            products={products}
          />
        </div>
      </div>
    </div>
  );
};

export default function Home(props) {
  const { data, errors } = props;

  if (errors && errors.length > 0) {
    return <Error statusCode={500} />;
  } else if (!data) {
    return <Error statusCode={404} />;
  }
  const looks = data.looks.items;
  return (
    <div className={styles.container}>
      {looks.map((look) => (
        <Look key={look._id} {...look} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const res = {
    props: {
      data: null,
      errors: null
    } 
  };
  try {
    const query = gql`
      query {
        looks: getLookList {
          items {
            _id
            name
            text: textHtml
            photo {
              path
            }
            products {
              _id
              name
              productId: takeshapeIoShopId
              product: takeshapeIoShop {
                title
                variants(first: 1) {
                  edges {
                    node {
                      title
                      price
                      storefrontId
                    }
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      transformedSrc(crop: CENTER, maxHeight: 400, maxWidth: 400)
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    res.props.data = await TakeShape.graphql(query);
  } catch (error) {
    console.error(error);
    res.props.errors = [error.message];
  }
  return res;
}
