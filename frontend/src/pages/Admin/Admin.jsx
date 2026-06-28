import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchProducts,
  fetchAllOrders,
  createProduct,
  deleteProduct,
} from "../../services/api";
import Header from "../../components/Header/Header";
import "./Admin.css";

function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create product form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const verifyAdmin = () => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (!userInfo || !userInfo.isAdmin) {
      alert("Unauthorized Access. Admin credentials required.");
      navigate("/");
      return false;
    }
    return true;
  };

  const loadData = async () => {
    if (!verifyAdmin()) return;

    try {
      setLoading(true);
      const prodData = await fetchProducts();
      const ordData = await fetchAllOrders();
      setProducts(prodData);
      setOrders(ordData);
      setError("");
    } catch (err) {
      setError("Failed to fetch admin data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        alert("Product deleted successfully.");
        loadData();
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        name,
        price: Number(price),
        image: image || undefined,
        category,
        countInStock: Number(countInStock),
        description,
      });

      alert("Product created successfully!");
      // Reset form
      setName("");
      setPrice("");
      setImage("");
      setCountInStock("");
      setDescription("");
      setActiveTab("products");
      loadData();
    } catch (err) {
      alert("Failed to create product.");
    }
  };

  return (
    <>
      <Header />
      <main className="container admin-container">
        <h1 className="admin-page-title">Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Manage Products
          </button>
          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Manage Orders
          </button>
          <button
            className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Add New Product
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading administration panel...</p>
          </div>
        ) : error ? (
          <div className="error-card card">
            <p>{error}</p>
          </div>
        ) : (
          <div className="admin-content mt-3">
            {activeTab === "products" && (
              <div className="admin-products-table card">
                <h2>Product Inventory ({products.length})</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product._id.substring(18)}...</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>₹{product.price.toLocaleString("en-IN")}</td>
                        <td>{product.countInStock}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="btn btn-danger btn-sm-action"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="admin-orders-table card">
                <h2>Customer Orders ({orders.length})</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Delivered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id.substring(18)}...</td>
                        <td>{order.user?.name || "Unknown User"}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>₹{order.totalPrice.toLocaleString("en-IN")}</td>
                        <td>{order.isPaid ? "✅ Paid" : "💵 Success (Mock)"}</td>
                        <td>{order.isDelivered ? "✅ Delivered" : "🕒 Processing"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "create" && (
              <div className="admin-create-form card">
                <h2>Add Premium Product</h2>
                <form onSubmit={handleCreateProduct}>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ergonomic Office Chair"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 5999"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock Count</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 15"
                        required
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <select
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Furniture">Furniture</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Image URL (Optional)</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Product Description</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Provide full features and details of the product..."
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary mt-3 btn-auth">
                    Create Product
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default Admin;