import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <h2>PixMart</h2>

      <div className="search-bar">
        <input type="text" placeholder="Search products..." />
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/cart">Cart</Link>
      </div>
    </header>
  );
}

export default Header;