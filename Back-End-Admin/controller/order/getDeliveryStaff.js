const orderModel = require("../../model/orderModel");

async function getDeliveryStaff(req, res) {
  try {
    const shippingOrders = await orderModel
      .find({
        "statusHistory.orderStatus": "Shipping",
      })
      .populate("userId", "name email") // Lấy thông tin người dùng
      .populate("statusHistory.createdBy", "name") // Lấy thông tin nhân viên xử lý
      .exec();
    res.json({
      message: "Đã tìm thấy tất cả các đơn hàng đang xử lý trong cơ sở dữ liệu",
      error: false,
      success: true,
      data: shippingOrders,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getDeliveryStaff;
