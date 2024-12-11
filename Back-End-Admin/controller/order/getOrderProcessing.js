const orderModel = require("../../model/orderModel");

async function getOrderProcessing(req, res) {
  try {
    const pendingOrders = await orderModel
      .find({
        "statusHistory.orderStatus": "Pending",
      })
      .populate("userId", "name email") 
      .populate("statusHistory.createdBy", "name") 
      .exec();

    // Nếu không tìm thấy đơn hàng, trả về thông báo
    if (pendingOrders.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng nào đang xử lý",
        error: false,
        success: true,
        data: [],
      });
    }

    // Trả về danh sách các đơn hàng đang xử lý
    res.json({
      message: "Đã tìm thấy tất cả các đơn hàng đang xử lý trong cơ sở dữ liệu",
      error: false,
      success: true,
      data: pendingOrders,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Đã có lỗi xảy ra trong quá trình lấy dữ liệu",
      error: true,
      success: false,
    });
  }
}

module.exports = getOrderProcessing;
