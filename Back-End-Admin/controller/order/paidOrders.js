const orderModel = require("../../model/orderModel");

async function paidOrders(req, res) {
  try {
    const paidOrders = await orderModel.find({
      status: "paid",
    });
    if (paidOrders.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng nào đã thanh toán thành công",
        error: false,
        success: true,
        data: [],
      });
    }
    res.json({
      message: "Tìm thấy tất cả các đơn hàng đã thanh toán thành công",
      error: false,
      success: true,
      data: paidOrders,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = paidOrders;
