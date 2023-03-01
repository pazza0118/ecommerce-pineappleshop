import Layout from "../core/Layout"
import { useState, useEffect } from "react";
import {
  getOrders, getStatusValues,
  updateOrderStatus
} from "./apiAdmin";
import { isAuthenticated } from "../auth/authFunctions";
import moment from "moment";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusValues, setStatusValues] = useState([]);
  const [run, setRun] = useState(false);

  const { user, token } = isAuthenticated()
  const loadOrders = () => {
    getOrders(user._id, token)
      .then(data => {
        if (data.err) {
          setError(data.err)
        } else {
          setOrders(data)
          setSuccess(true)
        }
      })
      .catch(err => console.log(err))
  }
  const loadStatusValues = () => {
    getStatusValues(user._id, token)
      .then(data => {
        if (data.err) {
          setError(data.err)
        } else {
          setStatusValues(data)
        }
      })
  }
  useEffect(() => {
    loadOrders()
    loadStatusValues()
  }, [run])
  const handleStatusChange = (evt, orderId) => {
    updateOrderStatus(user._id, token, orderId, evt.target.value)
      .then(data => {
        if (data.err) {
          setError(data.err)
        } else {
          console.log("setrun")
          setRun(!run)
          setSuccess(true)
        }
      })
      .catch(err => console.log(err))
  }
  const renderStatus = (order) => {
    if (statusValues) {
      return <div className="mb-2">
        <h1>{order.status}</h1>
        <select className="form-control" onChange={evt => handleStatusChange(evt, order._id)}>
          <option value="">Change Status..</option>
          {statusValues.map((status, id) => {
            return <option key={id} value={status}>{status}</option>
          })}
        </select>
      </div>
    }
  }
  const renderProductDetail = (key, value) => {
    return <div className="input-group mb-2">
      <div className="">
        <div className="input-group-text">{key}</div>
      </div>
      <input className="form-control" type="text" value={value} readOnly />
    </div>
  }
  const renderOrders = () => {
    if (orders) {
      return orders.map((order, id) => (
        <div key={id} className="mt-2"
          style={{ borderBottom: '5px solid indigo' }}>
          <h3 className="mt-4 mb-4 font-italic">
            Order ID: {order._id}
          </h3>
          <li className="list-group-item">
            {renderStatus(order)}
          </li>
          <li className="list-group-item">
            Delivery Address: {order.address}
          </li>
          <li className="list-group-item">
            Total Price: {order.totalPrice}
          </li>
          <li className="list-group-item">
            Transaction Id: {order.transactionId}
          </li>
          <li className="list-group-item">
            Ordered on: {moment(order.createdAt).fromNow()}
          </li>
          <li className="list-group-item">
            Ordered by: {order.user.name}
          </li>
          <h3 className="mt-4 mb-4 font-italic text-muted">
            Total Products in the order: {order.products.length}
          </h3>
          {order.products.map((product, id) => (
            <div className="mb-4" key={id}
              style={{ border: "1px solid indigo", padding: "20px" }}>
              {renderProductDetail("Product Name", product.name)}
              {renderProductDetail("Product Price", product.price)}
              {renderProductDetail("Product Quantity", product.count)}
              {renderProductDetail("Product Id", product._id)}
            </div>
          ))}
        </div>
      ))
    }
  }
  const renderOrderLength = () => {
    if(success){
      if (orders.length > 0) {
        return <h1 className="text-danger display-2">
          {`There are total of ${orders.length} orders`}
        </h1>
      } else {
        return <h1 className="text-danger">No orders</h1>
      }  
    }
  }
  return (
    <Layout title="Transaction Orders"
      description="Manage all orders" className="container">
      <div className="">
        <ul className="list-group">
          {orders && renderOrderLength()}
          {orders && renderOrders()}
        </ul>
      </div>
    </Layout>
  )
}
export default Order;