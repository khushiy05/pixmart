import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import Header from "../../components/Header/Header";
import "./Cart.css";

function Cart() {
  const { cartItems, updateCartQty, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/checkout");
    } else {
      navigate("/login?redirect=checkout");
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <Header />
      <main className="container">
        <h1 className="cart-page-title">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart-card card">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="btn btn-primary mt-3">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item-card card">
                  <div className="cart-item-image-wrapper">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-details">
                    <Link to={`/product/${item._id}`} className="cart-item-name">
                      {item.name}
                    </Link>
                    <p className="cart-item-price">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="qty-picker">
                      <select
                        value={item.qty}
                        onChange={(e) => updateCartQty(item._id, e.target.value)}
                        className="form-control qty-picker-select"
                      >
                        {[...Array(item.countInStock || 10).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="btn btn-secondary btn-delete"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary card">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Total Quantity:</span>
                <span>{totalQty} items</span>
              </div>
              <div className="summary-row total-row">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <button onClick={handleCheckout} className="btn btn-primary btn-checkout">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Cart;