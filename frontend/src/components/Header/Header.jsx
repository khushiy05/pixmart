import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import "./Header.css";

function Header() {
  const { cartItems } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchParams.get("search") || "");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    setUser(userInfo);
  }, []);

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      searchParams.set("search", searchVal);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
    navigate(`/?${searchParams.toString()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="header-container">
      <div className="header-inner">
        <Link to="/" className="brand-logo">
          Pix<span>Mart</span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search premium products..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>

          <Link to="/cart" className="nav-link cart-link">
            Cart
            {totalCartQty > 0 && <span className="cart-badge">{totalCartQty}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name.split(" ")[0]}</span>
              <div className="dropdown-menu">
                <Link to="/orders">My Orders</Link>
                {user.isAdmin && <Link to="/admin">Admin Dashboard</Link>}
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-login-header">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;