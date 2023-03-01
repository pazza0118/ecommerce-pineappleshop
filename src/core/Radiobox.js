import { useState } from "react";
const Radiobox = ({ prices, populateFilters }) => {

  const [values, setValues] = useState([]);
  const [error, setError] = useState(false);


  const handleChange = (evt) => {
    setValues(evt.target.value)
    populateFilters(evt.target.value)
  }

  return prices.map((p, i) => (

    <li key={i} className="list-unstyled mt-2">
      <input onChange={handleChange} type="radio"
        className="form-check-input" name={p}
        value={p._id}
      >
      </input>
      <label className="form-check-label ">{p.name}</label>
    </li>
  ))
}
export default Radiobox;