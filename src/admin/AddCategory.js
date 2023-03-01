import Layout from "../core/Layout";
import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import {
  signin, authenticate, isAuthenticated
} from "../auth/authFunctions";
import { createCategory } from "./apiAdmin";

const AddCategory = () => {
  const [name, setName] = useState("")
  const [createdCategoryName, setCreatedCategoryName] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)


  const { user, token } = isAuthenticated();



  function handleChange(evt) {
    setName(evt.target.value);
  }
  function handleSubmit(evt) {
    evt.preventDefault();
    console.log("name is ", name)
    console.log("user._id is, ", user._id)
    console.log("token is, ", token)
    createCategory(user._id, token, { name })
      .then(data => {
        if (data.err) {
          setSuccess(false)
          setError(data.err)
        } else {
          setSuccess(true);
          setError(false);
          setCreatedCategoryName(data.data.name)
          setName("");
        }
      })
      .catch(err => console.log("catch2, err is ", err))
    }
  const categoryForm =
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input className="form-control input"
          style={{ selectionColor: 'red' }}
          onChange={handleChange} type="text" value={name} />
      </div>
      <button className="btn btn-primary">Create Category</button>
    </form>

  const errorMsg = <div className="alert alert-danger"
    style={{ display: error ? "" : "none" }}>{error}
  </div>

  const successMsg = <div className="alert alert-info"
    style={{ display: success ? "" : "none" }}>
    {`Successfully created the category: ${createdCategoryName}`}
  </div>

  const goBack = <div className="mt-3">
    <Link to="/admin/dashboard">
      Go back to Admin Dashboard</Link>
  </div>

  return (
    <Layout title="Add a new category"
      description={`Good day ${user.name}, 
      ready to add a category?`} className="container">
      {errorMsg}
      {successMsg}
      {categoryForm}
      {goBack}
    </Layout>
  )
}
export default AddCategory;