import React, { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async (page = 1, query = "") => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/products", {
        params: { page, search: query },
      });
      setProducts(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(1, searchQuery); // Fetch products with the search query, reset to first page
  };

  const deleteProduct = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
          fetchProducts();
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire(
            "Error!",
            "There was an error deleting the product.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="container mt-5">
      <div className="row g-2 justify-content-between aling-items-center">
        <div className="col-md-4 col-6 order-md-1 order-1">
          <h4>Products</h4>
        </div>
        <div className="col-md-4 col-12 order-md-1 order-2">
          <input
            type="text"
            placeholder="Type to search by name, category, description"
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-control w-100"
          />
        </div>
        <div className="col-md-4 col-6 order-md-1 order-1">
          <div className="d-flex justify-content-end gap-2">
            <Link to="/create" className="btn btn-dark">
              Create
            </Link>
            <Link to="/bulk-create" className="btn btn-dark">
              Bulk Create
            </Link>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <>
                {products.map((product) => (
                  <ProductCard key={product.id} data={product} onDelete={deleteProduct} />
                ))}
                <div className="col-12 d-flex justify-content-center gap-5 aling-items-center mt-3">
                  <button
                    className="btn btn-dark"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-dark"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
