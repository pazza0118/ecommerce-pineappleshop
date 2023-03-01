import { API } from "../config";

export const getProfile = (userId, token) => {
  return fetch(`${API}/user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}
export const updateProfile = (userId, token, userData) => {
  return fetch(`${API}/user/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}
export const updateProfileLocalStorage = (updatedUserData, next) => {
  if(typeof window !== "undefined"){
    if(localStorage.getItem('jwt')){
      let auth = JSON.parse(localStorage.getItem('jwt'))
      auth.user = updatedUserData
      localStorage.setItem("jwt", JSON.stringify(auth));
      next();
    }
  }
}
export const getOrderDetails = (userId, token) => {
  return fetch(`${API}/order/details/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => console.log("1st catch getOrderDetails err"))
  }