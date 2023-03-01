import Layout from "../core/Layout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/authFunctions";
import { createProduct } from "./apiAdmin";
import { getCategories } from "../core/apiCore";
// import Select from "react-select";

const AddProduct = () => {
  const [values, setValues] = useState({
    name: "", description: "", price: "", categories: [],
    category: "", quantity: "", photo: {}, shipping: "",
    loading: false, error: false, success: false, createdProduct: "",
    redirectToProfile: false, formData: ""
  })
  const [run, setRun] = useState(false);
  // const [options, setOptions] = useState([
  //   // { label: "Select from the following...", value: "" },
  //   { label: "Blue", value: "Blue" },
  //   { label: "Red", value: "Red" }
  // ])

  const { name, description, price, category, categories,
    quantity, photo, shipping, loading, error, success,
    createdProduct, redirectToProfile, formData } = values;
  const { user, token } = isAuthenticated();

  const populateCategories = () => {
    getCategories()
      .then(data => {
        if (data.err) {
          setValues({ ...values, error: data.err })
        } else {
          setValues({
            ...values,
            categories: data, formData: new FormData()
          })
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    populateCategories();
  }, [run])

  function handleChange(field) {
    return function (evt) {
      const value = field === 'photo' ? evt.target.files[0] : evt.target.value;
      setValues({ ...values, [field]: value })
      formData.set(field, value)
    }
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if (category) {
      formData.set("category", category)
    }
    if (shipping) {
      formData.set("shipping", shipping)
    }

    setValues({ ...values, loading: true })
    createProduct(user._id, token, formData)
      .then(data => {
        if (data.err) {
          setValues({
            ...values, error: data.err,
            success: false, loading: false
          })
        } else {
          setValues({
            ...values, name: "", description: "", price: "",
            quantity: "", photo: {}, loading: false, error: false, success: true, createdProduct: data.name,
            formData: new FormData()
          })
          setRun(!run)
        }
      })
      .catch(err => console.log("catch2, err is ", err))
  }

  // const updateSelect = (evt) => {
  //   evt.preventDefault()
  //   let newOptions = [];
  //   newOptions.push({ label: "hi", value: "" })
  //   for (let i in options) {
  //     if (options[i].value) {
  //       newOptions.push(options[i])
  //     }
  //   }
  //   // console.log("updateSelect, newOptions is ", newOptions)
  //   setOptions(newOptions)
  // }

  const productForm =
    <form className="mb-3" onSubmit={handleSubmit}>

      <h4>Attach Image (Optional)</h4>

      <div className="form-group mb-3">
        <label className="btn btn-secondary">
          <input
            type="file"
            accept="image/*"
            name="photo"
            onChange={handleChange("photo")}></input>
        </label>
      </div>

      <div className="form-group mb-3">
        <label className="text-muted">Name</label>
        <input className="form-control mb-3"
          onChange={handleChange("name")}
          type="text" value={name} />
        <label className="text-muted">Description</label>
        <input className="form-control mb-3"
          onChange={handleChange("description")}
          type="text" value={description} />

        <label className="text-muted">Price</label>
        <input className="form-control mb-3"
          onChange={handleChange("price")}
          type="number" value={price} />
        <label className="text-muted">Quantity</label>
        <input className="form-control mb-3"
          onChange={handleChange("quantity")}
          type="number" value={quantity} />

        <label className="text-muted">Shipping</label>
        <select className="form-control mb-3"
          onChange={handleChange("shipping")}>
          <option>Select from the following... </option>
          <option value={false}>No</option>
          <option value={true}>Yes</option>
        </select>
        <label className="text-muted">Category</label>
        <select className="form-control"
          onChange={handleChange("category")}>
          <option>Select from the following... </option>
          {categories &&
            categories.map((c, i) =>
              <option key={i} value={c._id}>{c.name}</option>
            )
          }
        </select>
      </div>

      <button className="btn btn-primary">Create Product</button>
    </form>

  const errorMsg = <div className="alert alert-danger"
    style={{ display: error ? "" : "none" }}>{error}
  </div>

  const successMsg = <div className="alert alert-info"
    style={{ display: success ? "" : "none" }}>
    {`Successfully created the product: ${createdProduct}`}
  </div>

  const showLoading =
    <div style={{ display: loading ? "" : "none" }}>Loading</div>

  const goBack = <div className="mt-3">
    <Link to="/admin/dashboard">
      Go back to Admin Dashboard</Link>
  </div>

  return (
    <Layout title="Add a new product"
      description={`Good day ${user.name}, 
      ready to add a product?`} className="container">
      <div className="row">
        <div className="col-12">
          {showLoading}
          {errorMsg}
          {successMsg}
          <h1>Create Product</h1>
          <hr />
          {productForm}
          {goBack}
          <hr />
        </div>
      </div>
    </Layout>
  )
}
export default AddProduct;