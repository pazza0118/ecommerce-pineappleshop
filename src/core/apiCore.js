import { API } from "../config"
import queryString from "query-string";


// API = https://react-local-ecommerce-api.herokuapp.com/api
export const getProducts = (sortBy) => {
  console.log("getProducts")
  return fetch(`${API}/product/all?sortBy=${sortBy}&order=desc&limit=6`, {
    method: "GET"
  })
    .then(res => { return res.json() })
    .catch(err => console.log(err))
}

export const getCategories = () => {
  return fetch(`${API}/categories`, {
    method: "GET"
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}
export const getFilteredProducts = (skip, limit, filters) => {
  const data = { skip, limit, filters };
  // console.log("getFilteredProducts, filters is ", filters)
  return fetch(`${API}/products/by/search`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

export const getSearchedProducts = (params) => {
  const query = queryString.stringify(params)
  // console.log(`getSearchedProducts, 
  // params: ${params}, query: ${query}`)
  return fetch(`${API}/products/search?${query}`, {
    method: "GET"
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}
export const getProductDetails = (productId) => {
  return fetch(`${API}/product/read/${productId}`, {
    method: "GET",
    headers: {
      // Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  })
    .then(res => { return res.json() })
    .catch(err => console.log(err))
}
export const getRelatedProducts = (productId) => {
  return fetch(`${API}/products/related/${productId}`, {
    method: "GET"
  })
    .then(res => { return res.json() })
    .catch(err => console.log(err))
}
export const getBraintreeClientToken = (userId, token) => {
  return fetch(`${API}/braintree/getToken/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-type": "application/json"
    }
  })
  .then(res => res.json())
  .catch(err => console.log("getBraintreeClientToken err is", err))
}
export const processBuy = (userId, token, paymentData) => {
  return fetch(`${API}/braintree/buy/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(paymentData)
  })
  .then(res => res.json())
  .catch(err => console.log("processBuy err is", err))
}
export const createOrder = (userId, token, orderData) => {
  return fetch(`${API}/order/create/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify({order:orderData})
  })
  .then(res => res.json())
  .catch(err => console.log("createOrder err is", err))
}