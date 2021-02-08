import React, { useState } from "react";
import Image from "next/image";
import styles from "../styles/Banner.module.css";

const Banner = () => {
  const [visible, setVisible] = useState(true);
  return (
    <aside className={`${styles.container} ${!visible ? styles.hidden : ""}`}>
      <div className={styles.inner}>
        <div className={styles.logos}>
          <Image
            className={styles.logo}
            width={128}
            height={128}
            src='/static/TakeShape.png'
          />
        </div>
        <div className={styles.text}>
          <p>
            👋 &nbsp; Hey there! <a href='https://takeshape.io'>TakeShape</a>{" "}
            here.
          </p>
          <p>
            We built this sample project to show off TakeShape's Shopify integration. 🛍 &nbsp;
            Now you can use TakeShape to create rich e-commerce experiences on the Jamstack with the services
            you're already using. This project is built with{" "}
            <a href='https://nextjs.org'>Next.js</a> and deployed to{" "}
            <a href='https://vercel.com'>Vercel</a>.
          </p>
          <p></p>
          <p>Interested in building something like this?</p>
          <ol>
            <li>
              <a href='https://github.com/takeshape/takeshape-starter-shopify-nextjs'>
                Explore the repository in GitHub
              </a>
            </li>
            <li>
              Deploy this project to{" "}
              <a href='https://app.takeshape.io/add-to-takeshape?repo=https://github.com/takeshape/takeshape-starter-shopify-nextjs/tree/trunk/.takeshape/pattern'>
                TakeShape
              </a>{" "}
              and to{" "}
              <a href='https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftakeshape%2Ftakeshape-starter-shopify-nextjs&env=TAKESHAPE_TOKEN,TAKESHAPE_ENDPOINT&envDescription=Provide%20credentials%20for%20your%20TakeShape%20project&demo-title=Lookbook&demo-description=A%20statically-generated%20site%20using%20Next.js%2C%20showing%20off%20data%20from%20a%20TakeShape%20project%20connected%20to%20Shopify.&demo-url=https%3A%2F%2Fshape-shop-next.vercel.app%2F'>
                Vercel
              </a>
            </li>
            <li>
              <a href='https://www.takeshape.io/articles/building-a-rich-e-commerce-experience-on-the-jamstack-with-takeshape-shopify-and-next-js/'>Follow our walkthrough article to build this
              yourself</a>
            </li>
          </ol>
        </div>
      </div>
      <button className={styles.button} onClick={() => setVisible(false)}>
        Hide
      </button>
    </aside>
  );
};

export default Banner;
