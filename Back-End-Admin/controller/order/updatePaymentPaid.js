const orderModel = require("../../model/orderModel");

async function updatePaymentPaid(req, res) {
  try {
    const { orderId, isPaid } = req.body;

    if (!isPaid) {
     return res.status(404).json({
       message: "Bạn không thể check lại lần nữa",
       error: true,
       success: false,
     });
    }
    const updatePaymentPaid = await orderModel.findByIdAndUpdate(
      orderId,
      {
        isPaid: isPaid,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Đã check chuyển tiền thành công",
      error: false,
      success: true,
      data: updatePaymentPaid,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = updatePaymentPaid;
