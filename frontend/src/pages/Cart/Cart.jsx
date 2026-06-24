import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

function Cart() {
  const { cartItems } = useContext(CartContext);

  return (
    <div>
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <h3>Your cart is empty</h3>
      ) : (
        cartItems.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>₹{item.price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;