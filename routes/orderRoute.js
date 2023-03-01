const express = require('express');
const router = express.Router()

const { requireSignin, isAuth, isAdmin } =
    require('../controllers/authController')
const { getUserById } =
    require("../controllers/userController");
const { addOrderHistoryToUser } =
    require("../controllers/userController");
const { getOrderById, listAllOrders, createOrder, getStatusValues,
    updateOrderStatus, getOrderDetailsByUserId } =
    require("../controllers/orderController");
const { updateSoldAndQuantity } =
    require("../controllers/productController")

router.param("userId", getUserById)
router.param("orderId", getOrderById)

router.get('/order/status/list/:userId',
    requireSignin, isAuth, isAdmin, getStatusValues)
router.get('/order/list/:userId',
    requireSignin, isAuth, isAdmin, listAllOrders)
router.get('/order/details/:userId',
    requireSignin, isAuth, getOrderDetailsByUserId)
router.post('/order/create/:userId',
    requireSignin, isAuth,
    addOrderHistoryToUser, updateSoldAndQuantity, createOrder);
router.put('/order/:orderId/status/:userId',
    requireSignin, isAuth, isAdmin, updateOrderStatus)


module.exports = router;