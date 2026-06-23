import "./ProductCard.css";

function ProductCard({ image, title, price }) {
  return (
    <div className="product-card">
      <img src={image} alt={title} />

      <h3>{title}</h3>

      <p className="price">₹{price}</p>

      <button>Add to Cart</button>
    </div>
  );
}

export default ProductCard;