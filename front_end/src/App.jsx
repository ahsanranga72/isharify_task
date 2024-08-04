import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProductCard } from "./components/ProductCard";
import { Routes, Route } from "react-router-dom";
import Products from "./components/Products";
import CreateProduct from "./components/CreateProduct";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "./components/ProductDetails";
import ProductEdit from "./components/ProductEdit";
import ProductBulkCreate from "./components/ProductBulkCreate";

function App() {
  return (
    <>
      <div className="bg-dark text-center shadow-2">
        <h1 className="text-white py-2">Laravel & React App</h1>
      </div>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/create" element={<CreateProduct />} />
        <Route path="/details/:id" element={<ProductDetails />} />
        <Route path="/edit/:id" element={<ProductEdit />} />
        <Route path="/bulk-create" element={<ProductBulkCreate />} />
      </Routes>
      <div className="py-5"></div>
      <ToastContainer />
    </>
  );
}

export default App;
