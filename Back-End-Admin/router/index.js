const express = require("express");
const userSignIn = require("../controller/auth/userSignIn");
const userSignUp = require("../controller/auth/userSignUp");
const { authToken, localVariables } = require("../middleware/authToken");
const userDetails = require("../controller/auth/userDetails");
const AllUsers = require("../controller/auth/allUsers");
const allProduct = require("../controller/product/allProduct");
const allOrder = require("../controller/order/allOrder");
const getOrderProcessing = require("../controller/order/getOrderProcessing");
const updateStatusOrder = require("../controller/order/updateStatusOrder");
const updateProduct = require("../controller/product/updateProduct");
const deleteProduct = require("../controller/product/deleteProduct");
const updateUserRole = require("../controller/auth/updateUserRole");
const userLogOut = require("../controller/auth/userLogOut");
const authorizeRole = require("../middleware/authorizeRole");
const paidOrders = require("../controller/order/paidOrders");
const updatePaymentPaid = require("../controller/order/updatePaymentPaid");
const getProductsByStatus = require("../controller/product/getProductsByStatus");
const updateProductStatus = require("../controller/product/updateProductStatus");
const uploadProduct = require("../controller/product/uploadProduct");
const changePassword = require("../controller/auth/changePassword");
const getUserOrderStatus = require("../controller/order/getUserOrderStatus");
const getDeliveryStaff = require("../controller/order/getDeliveryStaff");
const getProductSpecificationsById = require("../controller/product/getProductSpecificationsById");
const getDashboardStats = require("../controller/order/getDashboardStats");
const getChartData = require("../controller/order/getChartData");
const getRecentOrders = require("../controller/order/getRecentOrders");
const getRevenuePerMonth = require("../controller/order/getRevenuePerMonth");
const router = express.Router();

router.post("/change-password", authorizeRole(["ADMIN"]), changePassword);
router.post("/register", userSignUp);
router.post("/login", userSignIn);
router.get("/user-details", authToken, userDetails);
router.get("/all-users", authorizeRole(["ADMIN"]), AllUsers);
router.get("/all-products", authorizeRole(["productManager"]), allProduct);
router.get("/all-orders", authorizeRole(["orderManager"]), allOrder);
router.get(
  "/order-processing",
  authorizeRole(["orderManager"]),
  getOrderProcessing
);
router.post(
  "/update-status-order",
  authorizeRole(["orderManager","deliveryStaff"]),
  updateStatusOrder
);
router.get("/paid-orders", authorizeRole(["paymentVerifier"]), paidOrders);
router.post(
  "/update-payment-paid",
  authorizeRole(["paymentVerifier"]),
  updatePaymentPaid
);
router.post(
  "/products-status",
  authorizeRole(["productManager"]),
  updateProductStatus
);
router.post(
  "/create-product",
  authorizeRole(["productManager"]),
  uploadProduct
);
router.post(
  "/update-product",
  authorizeRole(["productManager"]),
  updateProduct
);
router.post(
  "/delete-product",
  authorizeRole(["productManager"]),
  deleteProduct
);
router.post("/update-user-role", authorizeRole(["ADMIN"]), updateUserRole);
router.post("/products-filter-status", getProductsByStatus);
router.get(
  "/order-status-updates",
  authorizeRole(["orderManager"]),
  getUserOrderStatus
);
router.get(
  "/delivery-staff",
  authorizeRole(["deliveryStaff"]),
  getDeliveryStaff
);
router.get("/specifications-by-id/:productId", getProductSpecificationsById);
router.get("/logout", userLogOut);
router.get("/dashboard/stats", authorizeRole(["ADMIN"]), getDashboardStats);
router.get("/dashboard/chartData", authorizeRole(["ADMIN"]), getChartData);
router.get("/dashboard/recent", authorizeRole(["ADMIN"]), getRecentOrders);
router.get(
  "/dashboard/revenue-per-month",
  authorizeRole(["ADMIN"]),
  getRevenuePerMonth
);


module.exports = router;
