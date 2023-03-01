import Layout from "../core/Layout";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/authFunctions";

const SignIn = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        redirectToReferrer: false
    });

    const { email, password, error, loading, redirectToReferrer } = values;
    const { user } = isAuthenticated();

    function handleChange(inputField) {
        return function (evt) {
            setValues({ ...values, error: false, [inputField]: evt.target.value })
        }
    }
    function handleSubmit(evt) {
        evt.preventDefault();
        setValues({ ...values, loading: true });
        signin({ email, password })
            .then(data => {
                if (data.err) {
                    setValues({ ...values, error: data.err, loading: false });
                } else {
                    // authenticate(data, () => {
                    //     setValues({ ...values, redirectToReferrer: true });
                    // })
                    authenticate(data)
                    setValues({ ...values, redirectToReferrer: true });
                }
            })
            .catch(err => console.log("signin .catch, err is ", err))    // only triggers when network error encountered (for fetch specific?)
    }



    const showError = <div className="alert alert-danger"
        style={{ display: error ? "" : "none" }}>{error}</div>
    const showLoading = <div className=""
        style={{ display: loading ? "" : "none" }}>Loading</div>
    const pageRedirect = () => {
        if (redirectToReferrer) {           // if signed in -> user or admin dashboard
            if (user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />
            } else {
                return <Redirect to="/user/dashboard" />
            }
        }
        // going to /admin/dashboard if you are signed in as regular user
        // -> triggers Redirect to SignIn,
        // redirectToReferrer is set back to its initial value (false)
        // If the user was logged in, the below condition becomes true
        // Thus /admin/dashboard when you are regular user
        // -> redirects to Home Page
        if (isAuthenticated()) {
            return <Redirect to="/" />
        }
    }
    const signinForm =
        <form onSubmit={handleSubmit}>
            <div className="form-group">

                <label className="text-muted">Email</label>
                <input className="form-control"
                    onChange={handleChange("email")} type="email" value={email} />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input className="form-control"
                    onChange={handleChange("password")} type="password" value={password} />
            </div>
            <button className="btn btn-primary">Submit</button>
        </form>

    return (
        <Layout title="SignIn Page" description="Node React E-Commerce SignIn" className="container">
            <h1>SignIn</h1>
            {showError}
            {showLoading}
            {pageRedirect()}
            {signinForm}
        </Layout>
    )
}
export default SignIn;