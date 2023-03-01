import React, { Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import { signout } from "../auth/authFunctions";
import { isAuthenticated } from "../auth/authFunctions";
import { totalNumberOfCartItems } from "./cartHelper";
import { API } from "../config";

const activeLink = (history, path) => {
  if (history.location.pathname === path) {   // if current link url === url specified
    return { color: "#000000" }
  }
  return { color: "#ffffff" }
}
const handleClick = (history) => {
  signout(() => { history.push("/") });   // this is redirect to home page
}
const Menu = ({ history }) => { // history comes from withRouter(Menu)
  return (
    <div>
      {console.log("MENU")}
      {console.log("API is ", API)}
      <ul className="nav nab-tabs bg-primary">
        {!isAuthenticated() ? (
          <Fragment>
            <li className="nav-item">
              <Link className="nav-link"
                style={activeLink(history, "/")}
                to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link"
                style={activeLink(history, "/signup")}
                to="/signup">SignUp</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link"
                style={activeLink(history, "/signin")}
                to="/signin">SignIn</Link>
            </li>
            {/* <li>
              <Link className="nav-link"
                style={activeLink(history, "/cart")}
                to="/cart">Cart
                <sup><small className="cart-badge">
                  {totalNumberOfCartItems()}</small></sup>
              </Link>
            </li> */}
          </Fragment>
        ) : ""}
        {isAuthenticated() ? (
          <Fragment>
            <li className="nav-item">
              <Link className="nav-link"
                style={activeLink(history, "/")}
                to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link"
                style={activeLink(history, "/shop")}
                to="/shop">Shop</Link>
            </li>
            <li className="nav-item">
              <span className="nav-link"
                style={{ cursor: "pointer", color: "#ffffff" }}
                onClick={() => handleClick(history)}>
                Signout</span>
            </li>
            <li className="nav-item">
              {isAuthenticated() && isAuthenticated().user.role === 1
                ? <Link className="nav-link"
                  style={activeLink(history, "/admin/dashboard")}
                  to="/admin/dashboard">Dashboard</Link>
                : <Link className="nav-link"
                  style={activeLink(history, "/user/dashboard")}
                  to="/user/dashboard">Dashboard</Link>
              }
            </li>
            <li>
              <Link className="nav-link"
                style={activeLink(history, "/cart")}
                to="/cart">Cart
                <sup><small className="cart-badge">
                  {totalNumberOfCartItems()}</small></sup>
              </Link>
            </li>
            <li>
              {isAuthenticated() && isAuthenticated().user.role === 1
                ? <Link className="nav-link"
                  style={activeLink(history, "/admin/order")}
                  to="/admin/order">Order</Link>
                : ""
              }
            </li>
          </Fragment>
        ) : ""}
      </ul>
    </div>
  )
}
export default withRouter(Menu);