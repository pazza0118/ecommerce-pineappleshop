import { Link, Redirect } from "react-router-dom";
import { useState } from "react";
import ShowImage from "./ShowImage";
import moment from "moment";
import { addItem, updateItems, removeItem } from "./cartHelper";

const Card = ({
  product, showViewProductBtn = true, showAddToCartBtn = true,
  showRemoveFromCartBtn = false, showCartUpdate = false, run = undefined,
  setRun = f => f
}) => {

  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const addToCart = () => {
    addItem(product, () => { setRedirect(true) })
  }
  const redirectToCart = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />
    }
  }
  const viewProductButton = () => {
    if (showViewProductBtn) {
      return showViewProductBtn && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-outline-primary mt-2 mb-2">
            View Product
          </button>
        </Link>
      )
    }
  }
  const addToCartBtn = () => {
    if (showAddToCartBtn) {
      return <button onClick={addToCart}
        className="btn btn-outline-warning mt-2 mb-2">
        Add to Cart
      </button>
    }
  }
  const removeFromCartBtn = (productId) => {
    // console.log("removeFromCartBtn")
    // setRun(!run)  // this DOES cause infinite loop
    if (showRemoveFromCartBtn) {
      return <button onClick={() => {
        removeItem(productId)
        setRun(!run)  // this doesn't cause infinite loop
      }}
        className="btn btn-outline-danger mt-2 mb-2">
        Remove from Cart
      </button>
    }
  }
  const handleChange = (productId) => {
    return function (evt) {
    setRun(!run);   // this doesn't cause infinite loop

      // unnecessary, can't enter negative num
      // console.log("setCount starts running after this line")
      evt.target.value < 1 ?
        setCount(1) :
        setCount(evt.target.value)
      if (evt.target.value >= 1) {
        updateItems(productId, evt.target.value);
      } else {
        updateItems(productId, "");
      }
    }
  }
  const cartUpdateOptions = () => {
    // console.log("cartUpdateOptions")
    return showCartUpdate && <div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Adjust Quantity</span>
        </div>
        <input type="number" className="form-control"
          value={product.count} onChange={handleChange(product._id)} />
      </div>
    </div>
  }
  const showStock = quantity => {
    return quantity > 0 ?
      <span className="badge badge-primary badge-pill">In Stock</span> :
      <span className="badge badge-primary badge-pill">Out of Stock</span>
  }
  return (
    <div className="card">
      <h4 className="card-header">{product.name}</h4>
      <div className="card-body">
        {redirectToCart(redirect)}
        {/* {console.log("Card -> product is ", product)} */}
        <ShowImage item={product} url="product" />
        <p className="black-1">{product && product.description &&
          product.description.substring(0, 30)}</p>
        <p className="black-2">${product && product.price}</p>
        <p className="black-3">
          Added on {moment(product.createdAt).fromNow()} days ago
        </p>
        <div>
          {showStock(product.quantity)}
        </div>
        {viewProductButton()}
        {addToCartBtn()}
        {removeFromCartBtn(product._id)}
        {cartUpdateOptions(showCartUpdate)}
      </div>
    </div>
  )
}
export default Card;