import React, { useContext, useCallback, useState, useEffect, useRef } from 'react'
import CartContext from '../context/CartContext'
import styles from "../styles/Cart.module.css";

const Cart = () => {
  const { checkoutUrl, cartSize, lineItems, removeLineItem } = useContext(CartContext)
  const hasCart = checkoutUrl !== null && cartSize !== null

  const [cartOpen, setCartOpen] = useState(false);

  const toggleCart = useCallback((e) => {
    e.preventDefault();
    setCartOpen(!cartOpen);
  })

  const cartDetailRef = useRef(null);

  // Close cart detail if you click outside it
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartDetailRef.current && !cartDetailRef.current.contains(event.target) && event.target.tagName !== 'BUTTON') {
        setCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartDetailRef]);

  if (!hasCart) return null
  return (
    <span className={styles.cart} ref={cartDetailRef} >
      <a className={styles.openCart} href="#" onClick={toggleCart}>
        {cartSize > 0 && <span className={styles.counter}>{cartSize}</span>}
        <img className={styles.icon} src="/static/cart.png" />
      </a>
      {cartSize > 0
        ? (
          <a className={styles.checkout} href={checkoutUrl} target="_blank">Check Out</a>
        )
        : (
          <span className={[styles.checkout, styles.disabled].join(' ')}>Check Out</span>
        )
      }
      {cartOpen && <div className={styles.cartDetail}>
        <a href="#" className={styles.closeCartDetail} onClick={toggleCart}>×</a>
        {lineItems.length < 1 && 'The cart is empty.'}
        <div>
          {lineItems.map(lineItem =>
          <div className={styles.cartDetailRow} key={lineItem.id}>
            <div className={styles.cartDetailTitleRow}>
              <span className={styles.cartDetailTitle}>{lineItem.title}</span>
              {lineItem.quantity > 1 ? ` x${lineItem.quantity}` : ''}
            </div>
            <div>
              <a href="#" className="button" onClick={(e) => {e.preventDefault();removeLineItem(lineItem);}}>
                Remove
              </a>
            </div>
          </div>)}
        </div>
        </div>}
    </span>
  )
}

export default Cart