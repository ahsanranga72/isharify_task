import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/products/${id}`
      );
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between">
        <h4>Product Details</h4>
        <Link to="/" className="btn btn-dark">
          Back
        </Link>
      </div>

      <div className="row mt-4">
        <div className="col-md-6 col-12">
          <Carousel>
            {product.images.length > 0 ? (
              product.images.map((image) => (
                <Carousel.Item key={image.id}>
                  <img
                    className="d-block w-100"
                    src={`http://127.0.0.1:8000/storage/${image.path}`}
                    alt={product.name}
                  />
                </Carousel.Item>
              ))
            ) : (
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="http://127.0.0.1:8000/placeholder.webp" // Placeholder image URL
                  alt="No image available"
                />
              </Carousel.Item>
            )}
          </Carousel>
        </div>
        <div className="col-md-6 col-12">
          <h2>{product.name}</h2>
          <h6 className="mb-4">{product.category}</h6>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
