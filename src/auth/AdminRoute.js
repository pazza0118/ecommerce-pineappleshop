import React from "react";
import { Redirect, Route } from "react-router-dom";
import { isAuthenticated } from "./authFunctions";
const AdminRoute = ({ component: Component, ...rest }) => {       // put in component attr into Component, rest of the props goes into ...rest
  return (
    <Route
      {...rest}
      render={props => isAuthenticated() && isAuthenticated().user.role === 1 ?
        <Component {...props} /> :
        <Redirect to={{
          pathname: "/signin",            
          state: props.location.state
        }} />
        // <Redirect to={{pathname: "/signin", state: { from: props.location } }} />
      }
    />
  )
}
export default AdminRoute;