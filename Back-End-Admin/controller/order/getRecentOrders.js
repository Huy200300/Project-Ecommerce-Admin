const orderModel = require("../../model/orderModel");

async function getRecentOrders(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const orders = await orderModel.find().sort({ createdAt: -1 }).limit(limit);

    console.log(orders);

    res.status(200).json({
      message: "success",
      success: true,
      error: false,
      results: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getRecentOrders;
