import { API } from "../config";

const ShowImage = ({ url, item }) => {
  return (
    <div className="product-img-container">
      {/* http://localhost:8000/api/product/photo/${item._id} */}
      {/* {console.log("img src is ", `${API}/${url}/photo/${item._id}`)} */}
      <img src={`${API}/${url}/photo/${item._id}`}
        alt={item.name} className="product-img mb-3" 
        style={{ maxHeight: "100%", minHeight: "100%" }}>
      </img>
    </div>
  )
}
export default ShowImage;