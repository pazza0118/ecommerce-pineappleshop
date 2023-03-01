import { useState, useEffect } from "react";
import { getCategories, getSearchedProducts } from "./apiCore";
import Card from "./Card";

const Search = () => {

  const [values, setValues] = useState({
    categories: [],
    category: "",
    searchInput: "",
    searchedProducts: [],
    searched: false
  })
  const { categories, category, searchInput,
    searchedProducts, searched } = values

  const loadCategories = () => {
    getCategories()
      .then(data => {
        if (data.err) {
          console.log("err is ", data.err)
        } else {
          setValues({ ...values, categories: data })
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    loadCategories();
  }, [])

  const handleChange = (fieldName) => {
    return function (evt) {
      setValues({
        ...values, [fieldName]: evt.target.value,
        searched: false
      });
    }
  }

  const searchProducts = () => {
    if (searchInput) {
      getSearchedProducts({
        searchInput: searchInput || undefined,
        category: category
      })
        .then(data => {
          if (data.err) {
            console.log(data.err)
          } else {
            setValues({ ...values, searchedProducts: data, searched: true })
          }
        })
    }
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    searchProducts()
  }

  const loadSearchedProducts = (searchedProducts = []) => {
    return (
      <div>
        <h2 className="mt-4 mb-4">
          {loadSearchMsg(searched, searchedProducts)}
        </h2>
        <div className="row">
          {searchedProducts.map((p, id) => (
            <Card key={id} product={p} />
          ))}
        </div>
      </div>
    )
  }

  const loadSearchMsg = (searched, searchedProducts) => {
    if (searched && searchedProducts.length > 0) {
      return `Found ${searchedProducts.length} products`
    }
    if (searched && searchedProducts.length < 1) {
      return `No products Found`
    }
  }

  const searchForm =
    <form onSubmit={handleSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <select
              className="form-control btn mr-2"
              onChange={handleChange("category")}
              style={{padding:"0px"}}
            >
              <option value="all">Pick Category</option>
              {categories.map((c, id) => (
                <option key={id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="input-group-append" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
          <input type="search" className="form-control"
            onChange={handleChange("searchInput")}
            placeholder="Search By Name" />

          </div>

          <div className="btn input-group-append"
            style={{ border: "none" }}>
            <button className="input-group-text">Search</button>
          </div>
        </div>
      </span>
    </form>



  return (
    <div className="row">
      <div className="container mb-3">
        {searchForm}
      </div>
      <div className="container-fluid mb-3">
        {loadSearchedProducts(searchedProducts)}
      </div>
    </div>
  )
}
export default Search;