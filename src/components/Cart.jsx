import React, { useContext } from 'react'
import CartContext from '../context/CartContext'
import styles from "../styles/Cart.module.css";

const Cart = () => {
  const { checkoutUrl, cartSize } = useContext(CartContext)
  const hasCart = checkoutUrl !== null && cartSize !== null
  if (!hasCart) return null
  return (
    <span className={styles.cart}>
      {cartSize > 0 && <span className={styles.counter}>{cartSize}</span>}
      <img className={styles.icon} src="/static/cart.png" />
      {cartSize > 0
        ? (
          <a className={styles.checkout} href={checkoutUrl} target="_blank">Check Out</a>
        )
        : (
          <span className={[styles.checkout, styles.disabled].join(' ')}>Check Out</span>
        )
      }
    </span>
  )
}

export default Cart