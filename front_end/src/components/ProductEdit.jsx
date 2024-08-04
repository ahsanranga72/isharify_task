import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

const ProductEdit = () => {
  const [product, setProduct] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}`
        );
        setProduct(response.data);
        setSelectedImages(
          response.data.images.map(
            (image) => `http://127.0.0.1:8000/storage/${image.path}`
          )
        );
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const imageHandleChange = (e) => {
    if (e.target.files) {
      const fileArr = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedImages(fileArr);
    }
  };

  const renderPhotos = (source) => {
    return source.map((photo) => {
      return (
        <div className="col-md-3" key={photo}>
          <img src={photo} alt="Product" className="w-100" />
        </div>
      );
    });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("category", product.category);
    }
  }, [product, setValue]);

  const formSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("_method", "PUT");
    
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }

    await axios
      .post(`http://127.0.0.1:8000/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success("Product successfully updated!");
        navigate("/");
      })
      .catch((res) => {
        for (let key in res.response.data.errors) {
          toast.error(res.response.data.errors[key][0]);
        }
      });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between">
        <h4>Edit product</h4>
        <Link to="/" className="btn btn-dark">
          Back
        </Link>
      </div>
      <div className="card border-0 shadow-lg mt-4">
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="card-body">
            <div className="row g-4">{renderPhotos(selectedImages)}</div>
            <div className="mb-3 pt-4">
              <label htmlFor="images" className="form-label">
                Images
              </label>
              <input
                {...register("images[]")}
                type="file"
                id="images"
                className="form-control"
                multiple
                onChange={imageHandleChange}
                accept="image/*"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                id="name"
                className={`form-control ${errors.name && "is-invalid"}`}
                placeholder="name"
              />
              {errors.name && (
                <p className="invalid-feedback">Please enter product name</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <input
                {...register("category", { required: true })}
                type="text"
                id="category"
                className={`form-control ${errors.category && "is-invalid"}`}
                placeholder="category"
              />
              {errors.category && (
                <p className="invalid-feedback">
                  Please enter product category
                </p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                {...register("description")}
                type="text"
                id="description"
                className={"form-control"}
                placeholder="description"
                cols={3}
              ></textarea>
            </div>
            <button className="btn btn-dark float-end mb-4">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
