import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../../services/api";
import Header from "../../components/Header/Header";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        navigate("/login?redirect=orders");
        return;
      }

      try {
        setLoading(true);
        const data = await fetchMyOrders();
        setOrders(data);
        setError("");
      } catch (err) {
        setError("Failed to fetch order history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, [navigate]);

  return (
    <>
      <Header />
      <main className="container orders-container">
        <h1 className="orders-page-title">My Orders</h1>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Retrieving your order records...</p>
          </div>
        ) : error ? (
          <div className="error-card card">
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders-card card">
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card card">
                <div className="order-header">
                  <div>
                    <span className="order-meta-label">ORDER ID:</span>
                    <span className="order-meta-val">{order._id}</span>
                  </div>
                  <div>
                    <span className="order-meta-label">DATE PLACED:</span>
                    <span className="order-meta-val">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="order-meta-label">TOTAL AMOUNT:</span>
                    <span className="order-meta-val text-primary-color">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="order-items-grid">
                  <div className="order-items-box">
                    <h4>Items</h4>
                    {order.orderItems.map((item) => (
                      <div key={item._id} className="order-item-row">
                        <span>
                          {item.name} <strong>× {item.qty}</strong>
                        </span>
                        <span>₹{item.price.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-status-box">
                    <h4>Delivery & Payment</h4>
                    <div className="status-row">
                      <span>Payment:</span>
                      <span
                        className={`badge ${
                          order.isPaid ? "badge-success" : "badge-pending"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Success (Mock)"}
                      </span>
                    </div>

                    <div className="status-row">
                      <span>Delivery Status:</span>
                      <span
                        className={`badge ${
                          order.isDelivered ? "badge-success" : "badge-pending"
                        }`}
                      >
                        {order.isDelivered ? "Delivered" : "Processing"}
                      </span>
                    </div>

                    <div className="shipping-address-summary">
                      <strong>Shipping to:</strong>
                      <p>
                        {order.shippingAddress.address}, {order.shippingAddress.city} -{" "}
                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default Orders;