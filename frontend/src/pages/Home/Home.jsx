import "./Home.css";
import Header from "../../components/Header/Header";
import ProductCard from "../../components/ProductCard/ProductCard";
import products from "../../data/products";

function Home() {
  return (
    <>
      <Header />

      <div className="hero">
        <h1>Welcome to PixMart</h1>
        <p>Best Deals Every Day</p>
      </div>

      <div className="products-container">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
          />
        ))}
      </div>
    </>
  );
}

export default Home;