import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically inject JWT Token from localStorage
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

// Authentication
export const loginUser = async (credentials) => {
  const { data } = await API.post("/users/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await API.post("/users", userData);
  return data;
};

// Products
export const fetchProducts = async (keyword = "", category = "") => {
  const { data } = await API.get(
    `/products?keyword=${keyword}&category=${category}`
  );
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await API.post("/products", productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await API.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/products/${id}`);
  return data;
};

// Orders
export const createOrder = async (orderData) => {
  const { data } = await API.post("/orders", orderData);
  return data;
};

export const fetchOrderById = async (id) => {
  const { data } = await API.get(`/orders/${id}`);
  return data;
};

export const fetchMyOrders = async () => {
  const { data } = await API.get("/orders/myorders");
  return data;
};

export const fetchAllOrders = async () => {
  const { data } = await API.get("/orders");
  return data;
};

// Database Seeding Utility
export const seedDatabase = async () => {
  const { data } = await API.post("/seed");
  return data;
};

export default API;
