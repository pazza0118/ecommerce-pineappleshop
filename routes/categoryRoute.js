const express = require('express');
const router = express.Router()
const {createCategory, getCategoryById, readCategory, updateCategory, deleteCategory, listCategory} = require("../controllers/categoryController")
const {requireSignin, isAuth, isAdmin} = require('../controllers/authController')
const {getUserById} = require('../controllers/userController')

router.param("userId", getUserById);    // will grab user data into req.profile for any route routed to "userId"
router.param("categoryId", getCategoryById);    // will grab category data into req.category for any route routed to "categoryId"

router.get("/category/:categoryId", readCategory)
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, createCategory)
router.put("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, updateCategory)
router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, deleteCategory)
router.get("/categories", listCategory)
module.exports = router;