import { useState, useEffect } from "react";
import { getCategories, getFilteredProducts } from "./apiCore";
import Layout from "./Layout";
import Checkbox from "./Checkbox";
import Radiobox from "./Radiobox";
import { prices } from "./fixedPrices";
import Card from "./Card";

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] }
  });
  const [allCategories, setAllCategories] = useState([]);
  const [error, setError] = useState();
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [limit, setLimit] = useState(3);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [value, setValue] = useState(0);

  const populateCategories = () => {
    getCategories()
      .then(data => {
        if (data.err) { setError(data.err); }
        else { setAllCategories(data); }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    populateCategories();
    loadFilteredProducts()
  }, [])

  const handlePrice = id => {
    let priceValues = [];
    for (let key in prices) {
      if (prices[key]._id === parseInt(id)) {
        priceValues = prices[key].price;
      }
    }
    return priceValues;
  }

  const populateFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    if (filterBy === "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    } else {
      newFilters.filters[filterBy] = filters;
    }
    loadFilteredProducts(myFilters.filters);
    setMyFilters(newFilters)
  }

  const loadFilteredProducts = (filters) => {
    let resetSkip = 0;
    getFilteredProducts(resetSkip, limit, filters)
      .then(data => {
        if (data.err) {
          setError(data.err);
        } else {
          setFilteredProducts(data.data);
          setSize(data.size);
          setSkip(0);
        }
      })
      .catch(err => console.log("catch err", err));
  }

  const loadMoreFilteredProducts = () => {
    let toSkip = skip + size;
    getFilteredProducts(toSkip, limit, myFilters.filters)
      .then(data => {
        if (data.err) {
          setError(data.err);
        } else {
          setFilteredProducts([...filteredProducts, ...data.data]);
          setSize(data.size);
          setSkip(toSkip);
        }
      })
      .catch(err => console.log("catch err", err));
  }

  const loadMoreButton = () => {
    // console.log("loadMoreButton running")
    return (
      size > 0 && size >= limit && (
        <button
          onClick={loadMoreFilteredProducts}
          className="btn btn-warning mb-5">Load More</button>
      )
    )
  }

  return (
    <Layout title="Shop" description="e-commerce shop"
      className="container">
      <div className="row">
        <div className="col-4">
          <h4>Filter by categories</h4>
          <ul>
            <Checkbox categories={allCategories}
              populateFilters={filters =>
                populateFilters(filters, "category")} />
          </ul>

          <h4>Filter by prices</h4>
          <ul>
            <Radiobox prices={prices}
              populateFilters={filters =>
                populateFilters(filters, "price")} />
          </ul>
        </div>
        <div className="col-8">
          <div className="row">
            {filteredProducts.map((p, id) => (
              <div key={id} className="col-4 mb-3">
                <Card product={p} />
              </div>
            ))}
          </div>
          {loadMoreButton()}
        </div>
      </div>
    </Layout >
  )
}
export default Shop;