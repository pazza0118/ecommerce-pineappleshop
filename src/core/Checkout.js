import { totalCartPrice, emptyCart } from "./cartHelper"
import { useState, useEffect } from "react";
import {
  getBraintreeClientToken, processBuy,
  createOrder
} from "./apiCore";
import { isAuthenticated } from "../auth/authFunctions";
import Dropin from "braintree-web-drop-in-react";

const Checkout = ({ items, setRun = f => f, run = undefined }) => {

  const [braintreeData, setBraintreeData] = useState({
    clientToken: null,
    instance: {},
    address: '',
    success: "",
    error: ""
  })
  const { clientToken, instance, address, success, error } = braintreeData;
  const userId = isAuthenticated() && isAuthenticated().user._id
  const token = isAuthenticated() && isAuthenticated().token

  const loadBrainTreeClientToken = (userId, token) => {
    getBraintreeClientToken(userId, token)
      .then(data => {
        if (data.err) {
          setBraintreeData({ ...braintreeData, error: data.err });
        } else {
          setBraintreeData({ ...braintreeData, clientToken: data.clientToken });
        }
      })
      .catch(err => console.log("getBraintreeClientToken, err is ", err))
  }

  useEffect(() => {
    loadBrainTreeClientToken(userId, token)
  }, [])

  const buy = () => { // use async and await ffs
    console.log("instance is ", instance)
    let getNonce = instance.requestPaymentMethod()
      .then(res => {
        const paymentData = {
          nonce: res.nonce,
          totalPrice: totalCartPrice()
        }
        processBuy(userId, token, paymentData)
          .then(data => {
            const orderData = {
              products: items,
              address: address,
              totalPrice: data.transaction.amount,
              transactionId: data.transaction.id,
            }
            createOrder(userId, token, orderData)
              .then(res => {
                setBraintreeData({ ...braintreeData, success: true })
                emptyCart()
                setRun(!run)
              })
              .catch(err => console.log("createOrder err is ", err))
          })
          .catch(err => console.log("processBuy, err is ", err))
      })
      .catch(err => {
        setBraintreeData({ ...braintreeData, error: err.message })
      })
  }
  const handleChange = (evt) => {
    setBraintreeData({ ...braintreeData, address: evt.target.value })
  }

  const renderPaymentForm = () => {
    if (items.length > 0 && clientToken) {
      return (
        <div onBlur={() => setBraintreeData({ ...braintreeData, error: "", success: "" })}>
          <div className="form-group mb-3">
            <label className="text-muted">Deliver Address</label>
            <textarea
              className="form-control" value={address}
              onChange={handleChange}
              placeholder="Enter delivery address here...">
            </textarea>
          </div>
          <Dropin
            options={{
              authorization: clientToken,
              paypal: { flow: 'vault' }
            }}
            onInstance={instance => braintreeData.instance = instance}
          />
          <button className="btn btn-success btn-block"
            onClick={buy}>Pay</button>
        </div>
      )
    }
  }
  const renderTotalPrice = () => {
    return <p>The total is ${totalCartPrice()}</p>
  }

  const showSuccess =
    <div className="alert alert-info"
      style={{ display: success ? "" : "none" }}>
      Transaction completed successfully!</div>

  const showError =
    <div className="alert alert-danger"
      style={{ display: error ? "" : "none" }}>{error}</div>

  return <div>
    {/* {console.log("return")} */}
    <h1>Check Out</h1>
    <hr />
    <div>
      {renderTotalPrice()}
    </div>
    <div>
      {showSuccess}
      {showError}
      {renderPaymentForm()}
    </div>
  </div>
}
export default Checkout;