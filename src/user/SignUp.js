import Layout from "../core/Layout";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../auth/authFunctions";

const SignUp = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        error: "",
        success: false
    });
    const { name, email, password, error, success } = values;
    function handleChange(inputField) {
        return function (evt) {
            setValues({ ...values, error: false, [inputField]: evt.target.value })
        }
    }
    function handleSubmit(evt) {
        evt.preventDefault();
        signup({ name, email, password })
            .then(data => {
                if (data.err) {
                    setValues({ ...values, error: data.err, success: false })
                } else {
                    setValues({
                        name: "",
                        email: "",
                        password: "",
                        error: "",
                        success: true
                    })
                }
            })
            .catch(err => console.log("signup .catch, err is ", err))    // only triggers when network error encountered (for fetch specific?)
    }

    const showError = <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>{error}</div>
    const showSuccess = <div className="alert alert-info" style={{ display: success ? "" : "none" }}>
        Successfully created account, sign in here: <Link to="/signin">Signin</Link>
    </div>


    const signupForm = (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input className="form-control"
                    onChange={handleChange("name")} type="text" value={name} />
            </div>
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
    )
    return (
        <Layout title="SignUp Page" description="Node React E-Commerce SignUp" className="container">
            <h1>SignUp</h1>
            {showError}
            {showSuccess}
            {signupForm}
        </Layout>
    )
}
export default SignUp;