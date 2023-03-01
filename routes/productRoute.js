const express = require('express');
const router = express.Router()
const { getProductById, 
    createProduct, readProduct, updateProduct, deleteProduct, 
    getAllProducts, listRelatedProducts, listByCategories, listBySearch, 
    listSearchProducts, productPhoto }
    = require("../controllers/productController")
const { requireSignin, isAuth, isAdmin } = require('../controllers/authController')
const { getUserById } = require('../controllers/userController')

router.param("userId", getUserById);    // will grab user data into req.profile for any route routed to "userId"
router.param("productId", getProductById);    // will grab product data into req.product for any route routed to "productId"

router.get("/product/photo/:productId", productPhoto);


router.get("/product/all", getAllProducts)
router.post("/product/create/:userId",
    requireSignin, isAuth, isAdmin, createProduct)
router.get("/product/read/:productId/",
    readProduct)
router.delete("/product/delete/:productId/:userId",
    requireSignin, isAuth, isAdmin, deleteProduct)
router.put("/product/update/:productId/:userId",
    requireSignin, isAuth, isAdmin, updateProduct)


router.get("/products/search", listSearchProducts)
router.get("/products/related/:productId", listRelatedProducts)
router.get("/products/categories", listByCategories)
router.post("/products/by/search", listBySearch);

// router.get("/product/photo/:productId", productPhoto);



module.exports = router;