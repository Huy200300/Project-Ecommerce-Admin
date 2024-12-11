const StatusChange = require("../../model/StatusUpdate");
const Order = require("../../model/orderModel"); 

async function getUserOrderStatus(req, res) {
  try {
    const updates = await StatusChange.find()
      .populate("orderId")
      .populate("userId", "name") 
      .exec();

    const ordersWithCreators = await Promise.all(
      updates.map(async (update) => {
        const order = await Order.findById(update.orderId._id)
          .populate("userId", "name") 
          .exec();

        const lastStatus = order.statusHistory[order.statusHistory.length - 1];
        const createdByEmployee = lastStatus ? lastStatus.createdBy : null;

        return {
          ...update.toObject(),
          createdByEmployee: createdByEmployee, 
          orderUser: order.userId, 
        };
      })
    );

    res.status(200).json({
      message: "All Users found in the database successfully",
      error: false,
      success: true,
      data: ordersWithCreators,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getUserOrderStatus;
