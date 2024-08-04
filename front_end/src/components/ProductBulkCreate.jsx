import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ProductBulkCreate = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formSubmit = async (data) => {
    const formData = new FormData();
    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    await axios
      .post("http://127.0.0.1:8000/api/products/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success("Bulk products successfully added!");
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
        <h4>Create product</h4>
        <Link to="/" className="btn btn-dark">
          Back
        </Link>
      </div>
      <div className="card border-0 shadow-lg mt-4">
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="card-body">
            <div className="mb-3 pt-4">
              <label htmlFor="file" className="form-label">
                Upload file
              </label>
              <input
                {...register("file", { required: true })}
                type="file"
                id="file"
                className={`form-control ${errors.file && "is-invalid"}`}
                accept=".csv"
              />
              {errors.file && (
                <p className="invalid-feedback">Please use csv file</p>
              )}
            </div>
            <button className="btn btn-dark float-end mb-4">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductBulkCreate;
