import Error from "next/error";
import TakeShape, { getImageUrl } from "../takeshape.client";
import styles from "../styles/Home.module.css";
import ProductCard from "../components/ProductCard";
import AddToCart from "../components/AddToCart";

const Look = ({ photo, text, products }) => {
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
            products={products.map((product) => product.productId)}
          />
        </div>
      </div>
    </div>
  );
};

export default function Home(props) {
  const { data, errors } = props;

  if (errors) {
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
  const res = { props: {} };
  try {
    const query = `
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
    const data = await TakeShape.graphql(query);
    res.props = data;
    return res;
  } catch (error) {
    console.error(error);
    res.props = { errors: [error] };
  }
  return res;
}
