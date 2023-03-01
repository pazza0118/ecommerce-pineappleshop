import { useState } from "react";
const Checkbox = ({ categories, populateFilters }) => {

  const [categoryIds, setCategoryIds] = useState([]);
  const [error, setError] = useState(false);


  const handleToggle = (categoryId) => {
    return function (evt) {
      const categoryIndex = categoryIds.indexOf(categoryId);
      const newCategoryIds = [...categoryIds];

      if (categoryIndex === -1) { // add if not in list
        newCategoryIds.push(categoryId);
      } else {     // remove if in list
        newCategoryIds.splice(categoryIndex, 1)
      }

      setCategoryIds(newCategoryIds);
      // cannot use categoryIds here, they take split second to update
      populateFilters(newCategoryIds);  
    }
  }

  return categories.map((c, i) => (
    <li key={i} className="list-unstyled mt-2">
      <input onChange={handleToggle(c._id)} type="checkbox"
        className="form-check-input"
        value={categoryIds.indexOf(c._id) != -1}>
      </input>
      <label className="form-check-label ">{c.name}</label>
    </li>
  ))
}
export default Checkbox;