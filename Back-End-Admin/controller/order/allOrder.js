const orderModel = require("../../model/orderModel");

async function allOrder(req, res) {
  try {
    const allOrders = await orderModel.find();
    res.json({
      message: "All Users found in the database successfully",
      error: false,
      success: true,
      data: allOrders,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = allOrder;
