const formidable = require('formidable')
const _ = require("lodash")
const fileSystem = require('fs')
const Product = require("../models/productModel")
const { errorHandler } = require('../helpers/dbErrorHandler')
const { Console } = require('console')

// puts user data in req.product
exports.getProductById = (req, res, next, id) => {   // this id will come from route parameter
  console.log(`getProductById, id is ${id} next is ${next}`)
  Product.findById(id, (err, product) => {
    if (err || !product) {
      return res.status(400).json({ err: "Product not found" })
    }
    req.product = product;
    next();                                 // next needed since this is a middleware
  })
}

exports.productPhoto = (req, res) => {
  console.log("productPhoto")
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  // next(); // why is this necessary???
}

exports.listBySearch = (req, res) => {
  console.log("listBySearch")

  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";

  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let filters = req.body.filters;

  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      // console.log("key", key)  
      // console.log("req.body.filters[key]", req.body.filters[key])
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found"
        });
      }
      console.log("the filters used are ", findArgs)
      res.json({
        size: data.length,
        data
      });
    });
};

exports.listSearchProducts = (req, res) => {
  console.log("searchProducts")
  
  const query = {};
  console.log(`server-searchProducts, searchInput: 
  ${req.query.searchInput}, category: ${req.query.category}`)
  if (req.query.searchInput) {
    query.name = { $regex: req.query.searchInput, $options: "i" }
    if (req.query.category && req.query.category != "all") {
      query.category = req.query.category;
    }
    Product.find(query, (err, products) => {
      if (err || !products) {
        return res.status(400).json({ err })
      }
      res.json(products);
    })

  }
}

exports.listByCategories = (req, res) => {
  console.log("listByCategories")
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      res.status(400).json({ error: "category not found" })
    }
    res.json(categories)
  })
}

exports.listRelatedProducts = (req, res) => {
  console.log("listRelatedProducts")

  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  console.log("category is ", req.product.category)
  console.log("_id is ", req.product._id)
  // find products in the same category, but not including the selected product
  Product.find({ _id: { $ne: req.product._id }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")      // populate category, specifically _id and name of category
    .exec((err, products) => {
      if (err) {
        res.status(400).json({ error: "product not found" })
      }
      res.json(products)
    })
}

// lists products based on query received
exports.getAllProducts = (req, res) => {
  console.log("listProducts")

  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;    //
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        res.status(400).json({ error: "product not found" })
      }
      res.json(products)
    })
}


// Updates product
exports.updateProduct = (req, res) => {
  console.log("updateProduct")
  let productForm = new formidable.IncomingForm()     // get all form input into one object
  productForm.keepExtensions = true
  productForm.parse(req, (err, fields, files) => {    // if callback is called, all form fields and files are collected and passed
    if (err) {
      return res.status(400).json({ err: "Image could not be uploaded" })
    }
    const { name, description, price, category, quantity, shipping } = fields
    if (!name || !description || !price || !category || !quantity || !shipping) {
      return res.status(400).json({ err: "all fields required" })
    }

    // This method called inside route with productId, thus have access to req.product
    let product = req.product
    // store updated product data fields
    product = _.extend(product, fields)

    // store updated product photo data
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      product.photo.data = fileSystem.readFileSync(files.photo.filepath); // change path to filepath
      product.photo.contentType = files.photo.mimetype; // change typt to mimetype
    }
    product.save((err, result) => {
      if (err) {
        res.status(400).json({ err: errorHandler(err) })
      }
      res.json(result)
    })
  })
}

// send product data in json format
exports.deleteProduct = (req, res) => {
  console.log("deleteProduct")
  const product = req.product
  product.remove((err, deletedProduct) => {
    if (err) {
      res.status(400).json({ err: errorHandler(err) })
    }
    res.json({ message: "Product deleted successfully" })
  })
}

// send product data in json format
exports.readProduct = (req, res) => {
  console.log("readProduct")

  req.product.photo = undefined
  return res.json(req.product)
}



exports.createProduct = (req, res) => {
  console.log("createProduct")
  let productForm = new formidable.IncomingForm()     // get all form input into one object
  productForm.keepExtensions = true
  productForm.parse(req, (err, fields, files) => {    // if callback is called, all form fields and files are collected and passed
    if (err) {
      console.log(`err is ${err}, fields is ${fields}, files is ${files}`)
      console.log(err)
      console.log(fields)
      console.log(files)
      return res.status(400).json(err)
    }
    console.log(`createProduct, fields is ${fields} and files is ${files}`)
    const { name, description, price, category, quantity, shipping } = fields
    if (!name || !description || !price || !category || !quantity || !shipping) {
      return res.status(400).json({ err: "all fields required" })
    }

    // Create PRODUCT
    let product = new Product(fields)
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      product.photo.data = fileSystem.readFileSync(files.photo.filepath); // change path to filepath
      product.photo.contentType = files.photo.mimetype; // change typt to mimetype
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({ err: errorHandler(err) })
      }
      res.json(result)
    })
  })

}

exports.updateSoldAndQuantity = (req, res, next) => {
  console.log("updateSoldAndQuantity")

  let bulkOperation;
  bulkOperation = req.body.order.products.map(item => {
    return {
      updateOne: {
        "filter": { _id: item._id },
        "update": {
          $inc: { sold: +item.count, quantity: -item.count }
        }
      }
    }
  })
  // it works without the "{}" since it's optional, just doing it
  // this way to keep it consistent with lec

  // cannot be done with updateMany 
  // -> finds all docs meeting certain criteria and makes the same change
  // In this case, we need to make specific change for specific items, for multiple items
  Product.bulkWrite(bulkOperation, {}, (err, products) => {
    if(err){
      return res.status(400).json(err)
    }
    next();    
  })
}