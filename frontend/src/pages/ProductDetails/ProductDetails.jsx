import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProductById } from "../../services/api";
import { CartContext } from "../../context/CartContext";
import Header from "../../components/Header/Header";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
        setError("");
      } catch (err) {
        setError("Failed to load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate("/cart");
  };

  return (
    <>
      <Header />
      <main className="container">
        <Link to="/" className="back-link">
          ← Back to Catalog
        </Link>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading product details...</p>
          </div>
        ) : error ? (
          <div className="error-card card">
            <p>{error}</p>
          </div>
        ) : !product ? (
          <div className="error-card card">
            <p>Product not found.</p>
          </div>
        ) : (
          <div className="product-details-grid">
            <div className="product-details-image-container">
              <img
                src={product.image}
                alt={product.name}
                className="product-details-image"
              />
            </div>

            <div className="product-details-info card">
              <span className="product-category-badge">{product.category}</span>
              <h1 className="product-title">{product.name}</h1>

              <div className="product-rating-row">
                <span className="stars">
                  {"★".repeat(Math.round(product.rating || 4))}
                  {"☆".repeat(5 - Math.round(product.rating || 4))}
                </span>
                <span className="reviews-count">
                  ({product.numReviews || 10} reviews)
                </span>
              </div>

              <div className="product-price-row">
                <span className="price-label">Price:</span>
                <span className="price-value">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="product-status-row">
                <span>Status:</span>
                <span
                  className={`status-badge ${
                    product.countInStock > 0 ? "in-stock" : "out-of-stock"
                  }`}
                >
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <p className="product-description">{product.description}</p>

              {product.countInStock > 0 && (
                <div className="qty-selector-row">
                  <label htmlFor="qty-select">Quantity:</label>
                  <select
                    id="qty-select"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="form-control qty-select"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-add-cart"
                disabled={product.countInStock === 0}
              >
                {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default ProductDetails;