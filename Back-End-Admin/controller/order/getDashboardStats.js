const orderModel = require("../../model/orderModel");
const userModel = require("../../model/userModel");

async function getDashboardStats(req, res) {
  try {
    const [successfulOrdersCount, cancelledOrdersCount, totalOrders] =
      await Promise.all([
        orderModel.countDocuments({ "statusHistory.orderStatus": "Delivered" }),
        orderModel.countDocuments({ "statusHistory.orderStatus": "Cancelled" }),
        orderModel.countDocuments(),
      ]);

    const generalUsersCount = await userModel.countDocuments({
      role: "GENERAL",
    });

    res.json({
      message: "Total",
      success: true,
      error: false,
      totalOrders: totalOrders,
      successfulOrders: successfulOrdersCount,
      cancelledOrders: cancelledOrdersCount,
      totalGeneralUsers: generalUsersCount,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getDashboardStats;
