import Layout from "../core/Layout";
import { useState, useEffect } from "react"
import { isAuthenticated } from "../auth/authFunctions";
import { getAllProducts, deleteProduct } from "../admin/apiAdmin";
import { Link } from "react-router-dom"


const ManageProducts = (props) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [successUpdateMsg, setSuccessUpdateMsg] = useState('');
  const [run, setRun] = useState(false);

  const { user, token } = isAuthenticated();
  const loadProducts = () => {
    getAllProducts()
      .then(data => {
        console.log("getProducts - data is ", data)
        if (data.err) {
          setError(data.err)
        } else {
          setProducts(data)
        }
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    loadProducts()
  }, [run])



  const handleProductDelete = (productId) => {
    deleteProduct(user._id, token, productId)
      .then(data => {
        if (data.err) {
          setError(data.err)
        } else {
          setSuccessMsg(data.message)
          setRun(!run)
        }
      })
      .catch(err => console.log())
  }
  const renderAllProduct = () => {
    if (products.length > 0) {
      return <div>
        <ul className="list-group">
          {products.map((p, id) => {
            return <li key={id} className="list-group-item d-flex 
            justify-content-between align-items-center">
              <div className="col-8 d-flex justify-content-start">
                <strong className="">ID: {p._id}</strong>
                <strong className="ml-4">Name: {p.name}</strong>
              </div>
              <div className="col-4 d-flex justify-content-end">
                <Link className="ml-2 mr-2 " to={`/admin/update/product/${p._id}`}>
                  <span className="badge badge-warning badge-pill p-2">
                    Update</span>
                </Link>
                <span className="badge badge-danger badge-pill p-2 ml-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleProductDelete(p._id)}>Delete</span>
              </div>
            </li>
          })}
        </ul>
      </div>
    } else {
      return <h1>No Products Found</h1>
    }
  }
  const renderSuccessMsg = () => {
    if (successMsg) {
      return <div className="alert alert-info">
        {successMsg}</div>
    }
  }
  const renderSuccessUpdateMsg = () => {
    if (successUpdateMsg) {
      return <div className="alert alert-info">
        {successUpdateMsg}</div>
    }
  }
  return (
    <Layout title="Manage Products"
      description="Delete or update all products here"
      className="container">
        {console.log("props contains ", props)}
      <div className="row">
        <div className="col-12">
          <h1>Manage Products</h1>
          <hr />
          {renderSuccessMsg()}
          {renderAllProduct()}
          <hr />
        </div>
      </div>
    </Layout>
  )
}
export default ManageProducts