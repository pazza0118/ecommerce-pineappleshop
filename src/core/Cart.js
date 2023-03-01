import { Link } from "react-router-dom";
import Layout from './Layout';
import { addItem, getCartItems, totalCartPrice } from "./cartHelper";
import { useState, useEffect } from "react";
import Card from "./Card";
import Checkout from "./Checkout";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [run, setRun] = useState(false);

  const loadCartItems = () => {
    // console.log("loadCartItems")
    setItems(getCartItems());
  }
  useEffect(() => {
    loadCartItems()
  }, [run])   // useEffect runs again when there's change in "items"
  // removeItem -> changes items in localStorage ->
  // items are retrieved via getCartItems, from localStorage
  // loadCartItems -> re-render

  const renderProducts = () => {
    // console.log("renderProducts")
    return (
      <div>
        <h2>Your cart has {`${items.length}`}</h2>
        <hr />
        {/* {console.log("items are ", items)} */}
        {items.map((item, id) => (
          <Card key={id} product={item}
            showAddToCartBtn={false}
            showRemoveFromCartBtn={true} showCartUpdate={true}
            run={run} setRun={setRun} />
        ))}
      </div>
    )
  }
  const renderEmptyCartMsg = () => {
    return (
      <div>
        <h2>Cart is Empty</h2>
        <hr />
        <h2>To continue shopping, click <Link to="/shop">here</Link></h2>
      </div>
    )
  }
  return (
    <Layout title="Shopping Cart"
      description="Manage Cart Items" className="container-fluid">
      <div className="row">
        <div className="col-6">
          {items.length >= 1 ?
            renderProducts() :
            renderEmptyCartMsg()}
          <hr />
        </div>
        <div className="col-6">
          <Checkout items={items} setRun={setRun} run={run} />
        </div>
      </div>
    </Layout>
  )
}
export default Cart;