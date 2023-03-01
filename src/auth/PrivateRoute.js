import React from "react";
import { Redirect, Route } from "react-router-dom";
import { isAuthenticated } from "./authFunctions";
const PrivateRoute = ({ component: Component, ...rest }) => {       // put in component attr into Component, rest of the props goes into ...rest
    return (
        <Route
            {...rest}   // this is basically "exact path="/...", and this info is pertaining to the Route req, meaning that they go in routeProps "
            render={routeProps => isAuthenticated() ?   // routeProps are NOT the same as props, see general points #77 on the google doc
                <Component {...routeProps} /> :     // I think with this, props for Component contain some parts of routeProps, not sure why this is necessary
                // <Redirect to="/signin"/>
                <Redirect to={{
                    pathname: "/signin",            // user should always be redirected to signin pg if not signed in
                    state: routeProps.location.state
                }} />
                // <Redirect to={{pathname: "/signin", state: { from: props.location } }} />
            }
        />
    )
}
export default PrivateRoute;