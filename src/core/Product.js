import { useEffect, useState } from "react";
import Layout from "./Layout";
import { getProductDetails, getRelatedProducts } from "./apiCore";
import Card from "./Card";
import { isAuthenticated } from "../auth/authFunctions";
const Product = (props) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [error, setError] = useState(false);
  const productId = props.match.params.productId;

  const {user, token} = isAuthenticated();

  const loadSingleProduct = productId => {
    getProductDetails(productId)
      .then(data => {
        if (data.err) {
          setError(data.err);
        } else {
          setProduct(data);
          getRelatedProducts(productId)
            .then(data => {
              if (data.err) {
                setError(data.err);
              } else {
                setRelatedProducts(data);
              }
            })
        }
      })
      .catch(err => { console.log(err) })
  }

  useEffect(() => {
    loadSingleProduct(productId);
  }, [props])

  return (
    <Layout
      title={product && product.name}
      description={
        product &&
        product.description &&
        product.description.substring(0, 100)
      }
      className="container-fluid">
      <div className="row">
        <div className="col-8">
          <h1>Product</h1>
          {product &&        // without this, app tries to get product photo w/o the id
            product.description &&
            <Card product={product && product} 
            showViewProductBtn={false} showAddToCartBtn={true}/>
          }
          <hr />
        </div>
        <div className="col-4">
          <h1>Related Products</h1>
          {relatedProducts && relatedProducts.map((p, id) => (
            <Card key={id} product={p} />
          ))}
        </div>
      </div>
    </Layout>

  )
}
export default Product;