import Layout from "./Layout";
import React, { useState, useEffect } from "react";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";

const Home = () => {
  const [productsBySold, setProductsBySold] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);

  const loadProductsBySold = () => {
    getProducts("sold")
      .then(data => {
        if (data.err) {
          setError(data.err)
        } else {
          setProductsBySold(data)
        }
      })
      .catch(err => console.log(err))
  }
  const loadProductsByArrival = () => {
    getProducts("createdAt")
      .then(data => {
        if (data.err) {
          setError(data.err)
        } else {
          setProductsByArrival(data)
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    loadProductsBySold()
    loadProductsByArrival()
  }, [])
  return (
    <Layout title="Home Page"
      description="Node React E-Commerce App"
      className="container">
      <h1>Home</h1>
      <Search />
      <h2 className="mb-4 mt-4">Popular Products</h2>
      <div className="row">
        {productsBySold.map((p, i) => (
          <div key={i} className="col-4">
            <Card key={i} product={p} />
          </div>
        ))}
      </div>
      <h2 className="mb-4 mt-4">New Products</h2>
      <div className="row">
        {productsByArrival.map((p, i) => (
          <div key={i} className="col-4 mb-3">
            <Card key={i} product={p} />
          </div>
        ))}
      </div>
    </Layout>
  )
}
export default Home;