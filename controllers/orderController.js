const Order = require("../models/orderModel");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    // completely useless, order already populates all products
    // also products.product doesn't exist in schema, break the code
    // error is shown in the form of "bad request" to the route
    // with orderId, which makes it difficult to identify
    // .populate("products.product", "name price")  
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json(err)
      }
      req.order = order;
      next();
    })
}

exports.listAllOrders = (req, res) => {
  console.log("listAllOrders")
  Order.find()
    .populate('user', '_id name')
    .sort('-created')
    .exec((err, orders) => {
      if (err) { return res.status(400).json(err) }
      res.json(orders);
    })
}
exports.createOrder = (req, res) => {
  console.log("create order -> req.profile._id is", req.profile._id)
  req.body.order.user = req.profile       // add user info here
  const order = new Order(req.body.order)
  order.save((err, data) => {
    if (err) {
      res.status(400).json({ err })
    } else {
      console.log("data is ", data)
      res.json(data)
    }
  })
}

exports.getStatusValues = (req, res) => {
  console.log("getStatusValues")
  res.json(Order.schema.path("status").enumValues)
}
exports.updateOrderStatus = (req, res) => {
  console.log("updateOrderStatus")
  console.log("req.order is ", req.order)
  console.log("_id is ", req.body.orderId)
  console.log("status is ", req.body.newStatus)

  Order.findByIdAndUpdate(
    { _id: req.body.orderId },
    { $set: { status: req.body.newStatus } },
    (err, order) => {
      if (err) { return res.status(400).json(err) }
      console.log("updateOrderStatus ran, updated order is ", order)
      res.json(order)
    })
}
// get order's products based on order Id
// exports.getOrderDetailsByUserId = (req, res) => {
//   let userId = req.profile._id
//   console.log("userId is ", userId)
//   Order.find({ user: userId }, (err, orders) => {
//     if (err) {
//       console.log("error", err)
//       return res.status(400).json(err)
//     }
//     res.json(orders)
//   })
// }

exports.getOrderDetailsByUserId = (req, res) => {
  let userId = req.profile._id
  Order.find({ user: userId })
    .populate("user", "_id name")      
    .sort("-created")
    .exec((err,orders) => {
      if(err){ return res.status(400).json(err)}
      res.json(orders)
    })
}