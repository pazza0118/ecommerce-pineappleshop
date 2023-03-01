import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth/authFunctions";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = isAuthenticated();
  const adminInformation =
    <div className="card mb-5">
      <h3 className="card-header">Admin Information</h3>
      <ul className="list-group">
        <li className="list-group-item">{user.name}</li>
        <li className="list-group-item">{user.email}</li>
        <li className="list-group-item">
          {user.role === 1 ? "Admin" : "Registered User"}</li>
      </ul>
    </div>
  const adminLinks =
    <div className="card">
      <h3 className="card-header">Admin Links</h3>
      <ul className="list-group">
        <li className="list-group-item">
          <Link className="nav-link" to="/create/category">
            Create Category</Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/create/product">
            Create Product</Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/admin/order">
            View Orders</Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to={`/admin/manage/products/${user._id}`}>
            Manage Products</Link>
        </li>
      </ul>
    </div>


  return (
    <Layout title="Dashboard" description="Admin Dashboard"
      className="container">
      <div className="row">
        <div className="col-3">
          {adminLinks}
        </div>
        <div className="col-9">
          {adminInformation}
        </div>
      </div>
    </Layout>
  )
}
export default AdminDashboard;