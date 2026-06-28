import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, seedDatabase } from "../../services/api";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const searchKeyword = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts(searchKeyword, categoryFilter);
      setProducts(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch products. Is the server running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchKeyword, categoryFilter]);

  const handleSeed = async () => {
    try {
      setLoading(true);
      await seedDatabase();
      await loadProducts();
    } catch (err) {
      setError("Failed to seed database.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Navbar />

      <main className="container">
        {/* Banner Section */}
        <section className="hero-banner">
          <div className="hero-banner-content">
            <span className="hero-tag">EXCLUSIVE SUMMER SALE</span>
            <h1 className="hero-title">Elevate Your Lifestyle</h1>
            <p className="hero-subtitle">
              Explore curated, high-end electronics, fashion and essentials.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Curating your experience...</p>
          </div>
        ) : error ? (
          <div className="error-card card">
            <p>{error}</p>
            <button onClick={loadProducts} className="btn btn-secondary mt-3">
              Retry Connection
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-catalog card">
            <h2>No Products Found</h2>
            <p>We couldn't find any products matching your query.</p>
            <div style={{ marginTop: "20px" }}>
              <button onClick={handleSeed} className="btn btn-primary">
                Seed Sample Products Database
              </button>
            </div>
          </div>
        ) : (
          <div className="grid-cols-responsive">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.image}
                title={product.name}
                price={product.price}
                category={product.category}
                countInStock={product.countInStock}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default Home;