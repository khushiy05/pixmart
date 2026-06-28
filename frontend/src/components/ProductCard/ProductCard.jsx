import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./ProductCard.css";

function ProductCard({ id, title, price, image, category, countInStock }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productObj = {
      _id: id,
      name: title,
      price,
      image,
      countInStock: countInStock || 10,
    };
    addToCart(productObj, 1);
    alert(`${title} added to cart!`);
  };

  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className="product-card card">
        <div className="product-card-image-wrapper">
          <img src={image} alt={title} className="product-card-image" />
        </div>
        <div className="product-card-content">
          {category && <span className="product-card-category">{category}</span>}
          <h3 className="product-card-title">{title}</h3>
          <div className="product-card-footer">
            <span className="product-card-price">₹{price.toLocaleString("en-IN")}</span>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-sm product-card-btn"
              disabled={countInStock === 0}
            >
              {countInStock === 0 ? "Out of Stock" : "Add +"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;