const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema

const cartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true }
}, { timestamps: true })
module.exports = mongoose.model("CartItem", cartItemSchema);


const orderSchema = new mongoose.Schema({
  products: [cartItemSchema],             // hold on to these as products
  // products: [{
  //   name: { type: String, required: true },
  //   price: { type: Number, required: true },
  //   count: { type: Number, required: true }
  // }],
  totalPrice: Number,
  status: {
    type: String,
    default: "Not Processed",
    enum: ["Not Processed", "Processing",
      "Shipped", "Delivering", "Delivered"]
  },
  address: String,
  transactionId: {},
  user: { type: ObjectId, ref: "User" },    // hold on to these as ids
  updated: Date
}, {timestamps: true})
module.exports = mongoose.model("Order", orderSchema);
