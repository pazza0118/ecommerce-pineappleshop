import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth/authFunctions";
import { useState, useEffect } from "react";
import { getProfile, updateProfile, updateProfileLocalStorage } from "./apiUser";
import { Redirect } from "react-router-dom";

const UserProfileUpdate = ({ match }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    error: false,
    success: false,
    redirect: false
  })
  const { name, email, password, error, success } = profile;
  const { token } = isAuthenticated();
  const loadProfile = (userId) => {
    getProfile(userId, token)
      .then(data => {
        if (data.err) {
          setProfile({ ...profile, error: data.err })
        } else {
          setProfile({ ...profile, name: data.name, email: data.email })
        }
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    loadProfile(match.params.userId)
  }, [])

  const handleProfileChange = (evt, key) => {
    setProfile({ ...profile, [key]: evt.target.value })
  }
  const handleProfileSubmit = (evt) => {
    evt.preventDefault()
    const userData = { name: name, email: email, password: password }
    updateProfile(match.params.userId, token, userData)
      .then(data => {
        console.log("updated data is ", data)
        if (data.err) {
          setProfile({ ...profile, error: data.err })
        } else {
          // const updatedUserData = {name: data.name, email: data.email}
          updateProfileLocalStorage(data, () => {
            setProfile({
              ...profile, name: data.name, email: data.email,
              redirect: true, success: true
            })
          })
        }
      })
      .catch(err => console.log(err))
  }
  const renderUpdateForm = () => {
    if (name && email) {
      return <div>
        <div className="form-group mb-2">
          <label className="text-muted">Name</label>
          <input className="form-control" type="text" value={name}
            onChange={(evt) => handleProfileChange(evt, "name")} />
        </div>
        <div className="form-group mb-2">
          <label className="text-muted">Email</label>
          <input className="form-control" type="email" value={email}
            onChange={(evt) => handleProfileChange(evt, "email")} />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input className="form-control" type="password" value={password}
            onChange={(evt) => handleProfileChange(evt, "password")} />
        </div>
        <button className="btn btn-primary"
          onClick={handleProfileSubmit}>Submit</button>
      </div>
    }
  }
  return (
    <Layout title="Profile" description="Update User Profile"
      className="container">
      <div className="row">
        <div className="col-12">
          <h1>Profile Update</h1>
          {success ? <Redirect to="/cart" /> : null}
          {renderUpdateForm()}
        </div>
      </div>
    </Layout>
  )
}
export default UserProfileUpdate;