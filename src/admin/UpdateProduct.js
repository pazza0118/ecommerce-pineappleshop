import Layout from "../core/Layout";
import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { isAuthenticated } from "../auth/authFunctions";
import { getCategories } from "../core/apiCore";
import { getProduct, updateProduct } from "../admin/apiAdmin";


const UpdateProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: "", description: "", price: "", categories: [],
    quantity: "", photo: "", shipping: "", category: "",
    loading: false, error: false, success: false, updatedProduct: "",
    redirectToProfile: false, formData: ""
  })

  const { name, description, price, categories, category,
    quantity, photo, shipping, loading, error, success,
    updatedProduct, redirectToProfile, formData } = values
  const { user, token } = isAuthenticated();

  const populateProductAndCategories = () => {
    getProduct(match.params.productId)
      .then(data => {
        if (data.err) {
          setValues({ ...values, error: data.err })
        } else {
          getCategories()
            .then(res => {
              if (res.err) {
                setValues({ ...values, error: res.err })
              } else {
                // console.log("populate categories, res is ", res)
                setValues({
                  ...values,
                  name: data.name,
                  description: data.description,
                  price: data.price,
                  quantity: data.quantity,
                  category: data.category,
                  shipping: data.shipping,
                  formData: new FormData(),
                  categories: res
                })
              }
            })
            .catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    populateProductAndCategories();
  }, [])

  const handleFormChange = (evt, key) => {
    let value;
    if (key === "photo") {
      console.log("evt.target.files[0] is ", evt.target.files[0])
      value = evt.target.files[0]
    } else {
      value = evt.target.value
    }
    setValues({ ...values, [key]: value })  // for value of input
    formData.set(key, value)                // for sending data
  }
  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    if (name && description && price && quantity && category && shipping) {
      formData.set("name", name)
      formData.set("description", description)
      formData.set("price", price)
      formData.set("quantity", quantity)
      formData.set("category", category)
      formData.set("shipping", shipping)
    }
    setValues({ ...values, loading: true })
    updateProduct(user._id, token, match.params.productId, formData)
      .then(data => {
        if (data.err) {
          setValues({ ...values, error: data.err })
        } else {
          setValues({
            ...values, name: "", description: "", price: "",
            quantity: "", photo: "", loading: false,
            error: false, success: true, updatedProduct: data.name
          })
        }
      })
      .catch(err => console.log(err))
  }
  const renderProductForm =
    <form className="mb-3" onSubmit={handleFormSubmit}>
      {/* {console.log("return - categories ", categories)} */}
      <hr />
      <h4>Attach Image</h4>
      <div className="form-group mb-3">
        <label className="btn btn-secondary">
          <input
            type="file"
            accept="image/*"
            name="photo"
            onChange={(evt) => handleFormChange(evt, "photo")}>
          </input>
        </label>
      </div>

      <div className="form-group mb-3">
        <label className="text-muted">Name</label>
        <input className="form-control mb-3"
          onChange={(evt) => handleFormChange(evt, "name")}
          type="text" value={name} />
        <label className="text-muted">Description</label>
        <input className="form-control mb-3"
          onChange={(evt) => handleFormChange(evt, "description")}
          type="text" value={description} />

        <label className="text-muted">Price</label>
        <input className="form-control mb-3"
          onChange={(evt) => handleFormChange(evt, "price")}
          type="number" value={price} />
        <label className="text-muted">Quantity</label>
        <input className="form-control mb-3"
          onChange={(evt) => handleFormChange(evt, "quantity")}
          type="number" value={quantity} />

        <label className="text-muted">Shipping</label>
        <select className="form-control mb-3"
          onChange={(evt) => handleFormChange(evt, "shipping")}>
          <option>Select from the following... </option>
          <option value={false}>No</option>
          <option value={true}>Yes</option>
        </select>

        <label className="text-muted">Category</label>
        <select className="form-control mb-3"
          onChange={(evt) => handleFormChange(evt, "category")}>
          <option>Select from the following... </option>
          {categories &&
            categories.map((c, i) =>
              <option key={i} value={c._id}>{c.name}</option>
            )
          }
        </select>
      </div>
      <button className="btn btn-primary">Update Product</button>
    </form>

  const errorMsg = <div className="alert alert-danger"
    style={{ display: error ? "" : "none" }}>{error}
  </div>

  const successMsg = <div className="alert alert-info"
    style={{ display: updatedProduct ? "" : "none" }}>
    {`Successfully Updated The Product ${updatedProduct}`}
  </div>

  const showLoading =
    <div style={{ display: loading ? "" : "none" }}>Loading</div>

  const reDirect = () => {
    if (success) {
      return <Redirect to={`/admin/manage/products/${user._id}`} />
    }
  }
  const goBack = <div className="mt-3">
    <Link to={`/admin/manage/products/${user._id}`}>
      Go back to Mange Products</Link>
  </div>

  return (
    <Layout title="Update Products"
      description="Edit product data here"
      className="container">
      <div className="row">
        <div className="col-12">
          <h1>Update Products</h1>
          {reDirect}
          {showLoading}
          {errorMsg}
          {successMsg}
          {renderProductForm}
          {goBack}
          <hr />
        </div>
      </div>
    </Layout>
  )
}
export default UpdateProduct