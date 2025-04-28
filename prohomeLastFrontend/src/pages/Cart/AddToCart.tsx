import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AddToCart.module.css';
import { MdDelete } from 'react-icons/md';

// Define the types for the product in the cart
interface CartProduct {
  id: number;
  productName: string;
  productPrice: number;
  discountedPrice?: number;
  quantity: number;
  featureImage?: string;
  store_id?:string
}

function AddToCart() {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);

  useEffect(() => {
    // Retrieve the cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);
  }, []);

  const handleRemoveFromCart = (id: number) => {
    // Remove item from cart
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountedPrice || item.productPrice;
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  function truncateText(text: string, maxWords: number): string {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  }
  

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <h2 className="text-center">Your cart is empty</h2>
        <div className="text-center">
          <Link to="/" className={`btn btn-primary ${styles.continueShoppingButton}`}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-8xl md:text-2xl">Your Cart</h1>
      <div className="row">
        {cartItems.map((item) => (
          <div className="col-md-12 mb-3" key={item.id}>
            <div className={`d-flex align-items-center ${styles.cartItemBox}`}>
              <img
                src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${item.featureImage}`}
                alt={item.productName}
                className={styles.cartItemImage}
              />
              <div className={`ms-3 ${styles.cartItemDetails}`}>
              <h5 className={`${styles.cartItemName}`}>{truncateText(item.productName, 30)}</h5>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className={`btn btn-sm btn-outline-secondary ${styles.incrementDecrementButton}`}
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <h1 className='text-6xl md:text-3xl'>{item.quantity}</h1>
                  <button
                    className={`btn btn-sm btn-outline-secondary ${styles.incrementDecrementButton}`}
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className={`${styles.cartItemDetails} d-flex align-items-center justify-content-end me-4 gap-3`}>
                <p className={`${styles.cartItemPrice} mb-0`}>${(
                    (item.discountedPrice || item.productPrice) * item.quantity
                  )}
                </p>
                <button
                  className={`${styles.deleteCartItem}`}
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={`text-end ${styles.textend}`}>
        <h1 className='text-6xl md:text-3xl'>Total: ${calculateTotal()}</h1>
        <Link to="/checkout"><button className={`btn ${styles.checkoutBtn}`}>Proceed to Checkout</button></Link>
      </div>
    </div>
  );
}

export default AddToCart;
