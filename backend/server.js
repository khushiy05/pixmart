const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Seed model imports
const User = require("./models/User");
const Product = require("./models/Product");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Seeding endpoint to easily populate the DB
app.post("/api/seed", async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      isAdmin: true,
    });

    // Create regular user
    await User.create({
      name: "John Doe",
      email: "user@example.com",
      password: "password123",
      isAdmin: false,
    });

    // Default products
    const seedProducts = [
      {
        name: "Wireless Headphones",
        price: 1999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",
        description: "High-quality wireless headphones with active noise cancellation and 40h battery life.",
        category: "Electronics",
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
      },
      {
        name: "Smart Watch",
        price: 2499,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
        description: "Track your fitness, heart rate, sleep and receive notifications instantly.",
        category: "Electronics",
        countInStock: 7,
        rating: 4.0,
        numReviews: 8,
      },
      {
        name: "Premium Leather Jacket",
        price: 4999,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop",
        description: "100% genuine black leather jacket. Modern slim-fit design with durable zip closures.",
        category: "Fashion",
        countInStock: 5,
        rating: 4.8,
        numReviews: 24,
      },
      {
        name: "Mechanical Keyboard",
        price: 3499,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop",
        description: "RGB Backlit tactile blue switches mechanical gaming keyboard for pro-level responsiveness.",
        category: "Gaming",
        countInStock: 12,
        rating: 4.6,
        numReviews: 15,
      },
      {
        name: "Ergonomic Office Chair",
        price: 8999,
        image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop",
        description: "Breathable mesh back office chair with adjustable lumbar support, armrests and swivel.",
        category: "Furniture",
        countInStock: 4,
        rating: 4.3,
        numReviews: 9,
      },
      {
        name: "Ultra HD Action Camera",
        price: 5999,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop",
        description: "Waterproof sports action camera with 4K resolution, wide angle lens, and mounting kit.",
        category: "Electronics",
        countInStock: 0,
        rating: 4.2,
        numReviews: 5,
      }
    ];

    await Product.insertMany(seedProducts);

    res.json({ message: "Database Seeded successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Pixmart API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
