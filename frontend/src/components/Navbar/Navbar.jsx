import { useSearchParams } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  const categories = ["All", "Electronics", "Fashion", "Gaming", "Furniture"];

  const handleCategoryClick = (category) => {
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="navbar-container">
      <div className="navbar-inner">
        {categories.map((category) => (
          <button
            key={category}
            className={`navbar-item ${activeCategory === category ? "active" : ""}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Navbar;