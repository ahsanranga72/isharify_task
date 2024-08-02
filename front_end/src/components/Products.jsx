import React from "react";
import { ProductCard } from "./ProductCard";

const Products = () => {
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between">
        <h4>Products</h4>
        <a href="/create" className="btn btn-dark">
          Create
        </a>
      </div>
      <div className="row mt-4">
        <ProductCard />
      </div>
    </div>
  );
};

export default Products;
