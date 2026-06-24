import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./ProductCard.css";

function ProductCard({ image, title, price, id }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <img src={image} alt={title} />

      <h3>{title}</h3>

      <p>₹{price}</p>

      <button
        onClick={() =>
          addToCart({
            id,
            title,
            price,
            image,
          })
        }
      >
        Add To Cart
      </button>
    </div>
  );
}

export default ProductCard;