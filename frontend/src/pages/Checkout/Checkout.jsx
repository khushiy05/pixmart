import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { createOrder } from "../../services/api";
import Header from "../../components/Header/Header";
import "./Checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if cart is empty or not logged in
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login?redirect=checkout");
    } else if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      const payload = {
        orderItems,
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod: "Mock Payment",
        totalPrice: subtotal,
      };

      await createOrder(payload);
      clearCart();
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container checkout-container">
        <h1 className="checkout-page-title">Secure Checkout</h1>

        {error && <div className="auth-error">{error}</div>}

        <div className="checkout-grid">
          <form onSubmit={handleSubmit} className="checkout-shipping-form card">
            <h2>Shipping Address</h2>

            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <input
                id="address"
                type="text"
                required
                className="form-control"
                placeholder="123 Main St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                required
                className="form-control"
                placeholder="New Delhi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal / ZIP Code</label>
              <input
                id="postalCode"
                type="text"
                required
                className="form-control"
                placeholder="110001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                required
                className="form-control"
                placeholder="India"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className="payment-method-section">
              <h3>Payment Method</h3>
              <div className="payment-badge">Mock Credit Card / Netbanking</div>
            </div>

            <button type="submit" className="btn btn-primary btn-place-order" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <div className="checkout-summary-card card">
            <h2>Review Items</h2>
            <div className="checkout-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="checkout-item-row">
                  <span>
                    {item.name} <strong>× {item.qty}</strong>
                  </span>
                  <span>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div className="checkout-total-row">
              <span>Total Price:</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Checkout;
