import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth/authFunctions";
import { Link } from "react-router-dom";
import { getOrderDetails } from "./apiUser";
import moment from "moment"

const UserDashboard = () => {

  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user: { name, email, role, _id }, token } = isAuthenticated();

  const loadPurchaseHistory = () => {
    getOrderDetails(_id, token)
      .then(data => {
        if (data === null) {
          console.log("data is null")
          setSuccess(true);
          setPurchaseHistory(null);
        }
        else if (data.err) {
          console.log("data.err")
          setError(data.err);
        } else {
          console.log("setPurchaseHistory")
          setPurchaseHistory(data);
          setSuccess(true);
        }
      })
      .catch(err => console.log("2nd catch getOrderDetails err"))
  }
  useEffect(() => {
    loadPurchaseHistory()
  }, [])


  const userLinks =
    <div className="card">
      <h3 className="card-header">User Links</h3>
      <ul className="list-group">
        <li className="list-group-item">
          <Link className="nav-link" to="/cart">My Cart</Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to={`/profile/update/${_id}`}>
            Update Profile</Link>
        </li>
      </ul>
    </div>
  const renderUserInformation =
    <div className="card mb-5">
      <h3 className="card-header">User Information</h3>
      <ul className="list-group">
        <li className="list-group-item">{name}</li>
        <li className="list-group-item">{email}</li>
        <li className="list-group-item">
          {role === 1 ? "Admin" : "Registered User"}</li>
      </ul>
    </div>

  const renderPurchaseHistory = () => {
    if (success) {
      if (purchaseHistory.length < 1) {
        return <div className="card mb-5">
          <h1 className="card-header">Purchase History</h1>
          <p className="list-group-item">No orders found</p>
        </div>
      }
      return <div className="mb-5">
        {console.log("purchase history is ", purchaseHistory)}
        <h1 className="card-header">Purchase History</h1>
        {purchaseHistory.map((order, o_id) => {
          return <div key={o_id}>
            <hr />
            {order.products.map((product, p_id) => {
              return <ul key={p_id} className="list-group">
                <li className="list-group-item">Product Name: {product.name}</li>
                <li className="list-group-item">Product Price: {product.price}</li>
                <li className="list-group-item">
                  Purchased Date: {moment(product.createdAt).fromNow()}</li>
              </ul>
            })}
          </div>
        })}
      </div>
    }
    if (error) {
      return <div className="card mb-5">
        There was a problem with loading purchase history. {error}
      </div>
    }
  }

  return (
    <Layout title="Dashboard" description="User Dashboard"
      className="container">
      <div className="row">
        <div className="col-3">
          {userLinks}
        </div>
        <div className="col-9">
          {renderUserInformation}
          {renderPurchaseHistory()}
        </div>
      </div>
    </Layout>
  )
}
export default UserDashboard;

