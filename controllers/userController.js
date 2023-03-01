const User = require("../models/userModel")

// puts user data in req.profile
exports.getUserById = (req, res, next, id) => {   // this id will come from route parameter
  User.findById(id, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ err: "User not found" })
    }
    req.profile = user;                     // req.profile now stores user data
    next();                                 // next needed since this is a middleware
  })
}

exports.readUserProfile = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
}
exports.updateUserProfile = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    // req.profile._id,
    // { $set: req.body },   // updates existing values with req.body (updated content)
    req.body,   // updates existing values with req.body (updated content)
    { new: true },    // for returning udpated value
    (err, user) => {
      if (err) {
        return res.status(400).json({ err: "You are not authorized to perform this action" })
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      console.log("updateUserProfile - sendind user ", user)
      res.json(user);
    }
  )
}

exports.addOrderHistoryToUser = (req, res, next) => {
  // console.log("addOrderHistoryToUser -> req.profile._id is", req.profile._id)
  let history = [];

  req.body.order.products.forEach(item => {
    history.push({                   // yes, push is built in js function for adding obj to arrays
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transactionId: req.body.order.transactionId,
      totalPrice: req.body.order.totalPrice
    })
  })
  // ALTERNATIVE
  // history = req.body.order.products.map(item => {
  //   return {
  //     _id: item._id,
  //     name: item.name,
  //     description: item.description,
  //     category: item.category,
  //     quantity: item.count,
  //     transactionId: req.body.order.transactionId,
  //     totalPrice: req.body.order.totalPrice
  //   }
  // })
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (err, res) => {
      if (err) { return res.status(400).json({ err }) }
      next();
    })

}