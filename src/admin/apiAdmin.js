import { API } from "../config"

export const createCategory = (userId, token, category) => {
  return fetch(`${API}/category/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(category)
  })
    .then(res => res.json())
    .catch(err => console.log("catch1, err is ", err))
}
export const createProduct = (userId, token, product) => {
  console.log("createProduct running")
  for(const value of product.values()){
    console.log(value)
  }
  console.log("createProduct running")

  return fetch(`${API}/product/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      // "Content-Type": "application/json",    // this line is not needed
      // we are sending form input (FromData obj), not json
      Authorization: `Bearer ${token}`
    },
    body: product   // JSON.stringify(product) is necessary if sending json
  })                // however product is FormData obj, an array of arrays
    .then(res => {
      console.log("first .then complete")
      return res.json()
    })
    .catch(err => console.log("catch1, err is ", err))
}
export const getOrders = (userId, token) => {
  return fetch(`${API}/order/list/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json", // is this needed?
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => (res.json()))
    .catch(err => console.log("err is ", err))
}
export const getStatusValues = (userId, token) => {
  return fetch(`${API}/order/status/list/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json", // is this needed?
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => (res.json()))
    .catch(err => console.log("err is ", err))
}
export const updateOrderStatus = (userId, token, orderId, newStatus) => {
  console.log("updateStatusValues")
  console.log("orderId is ", orderId)
  console.log("newStatus is ", newStatus)
  return fetch(`${API}/order/${orderId}/status/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ orderId, newStatus })
  })
    .then(res => (res.json()))
    .catch(err => console.log("err is ", err))

}
export const getAllProducts = () => {
  console.log("getAllProducts")
  return fetch(`${API}/product/all?limit=undefined&sortBy=_id`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      // Authorization: `Bearer ${token}`
    }
  })
    .then(res => (res.json()))
    .catch(err => console.log("err is ", err))

}
export const getProduct = (productId) => {
  console.log("getProduct")
  return fetch(`${API}/product/read/${productId}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })
    .then(res => (res.json()))
    .catch(err => console.log("err is ", err))
}
export const updateProduct = (userId, token, productId, updatedProduct) => {
  console.log(`updateProduct ${userId}, ${token}, ${productId}, ${updatedProduct}`)
  return fetch(`${API}/product/update/${productId}/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      // No need to specify Content-Type -> auto assumes form data
      Authorization: `Bearer ${token}`
    },
    body: updatedProduct
  })
    .then(res => (res.json()))
    .catch(err => console.log("err is ", err))
}
export const deleteProduct = (userId, token, productId) => {
  console.log(`deleteProduct ${userId}, ${token}, ${productId}`)
  return fetch(`${API}/product/delete/${productId}/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      // No need to specify Content-Type -> auto assumes form data
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => (res.json()))
    .catch(err => console.log("err is ", err))
}
