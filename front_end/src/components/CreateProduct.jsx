import React, { useState } from "react";
import { useForm } from "react-hook-form";

const CreateProduct = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const imageHandleChange = (e) => {
    if (e.target.files) {
      const fileArr = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );

      setSelectedImages((prevImg) => prevImg.concat(fileArr));
    }
  };

  const renderPhotos = (source) => {
    return source.map((photo) => {
      return (
        <div className="col-md-3">
          <img src={photo} key={photo} className="w-100" />
        </div>
      );
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between">
        <h4>Create product</h4>
        <a href="/" className="btn btn-dark">
          Back
        </a>
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
                type="file"
                id="images"
                className="form-control"
                multiple
                onChange={imageHandleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                {...register('name', { required: true })}
                type="text"
                id="name"
                className={`form-control ${errors.name && "is-invalide"}`}
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
                {...register('category', { required: true })}
                type="text"
                id="category"
                className={`form-control ${errors.category && "is-invalide"}`}
                placeholder="category"
              />
              {errors.category && (
                <p className="invalid-feedback">Please enter product category</p>
              )}
            </div>
            <button className="btn btn-dark">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
