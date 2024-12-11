const orderModel = require("../../model/orderModel");
const userModel = require("../../model/userModel");

async function getChartData(req, res) {
  try {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    const currentYear = new Date().getFullYear();

    const orderStats = await orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
          successfulOrders: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    { $arrayElemAt: ["$statusHistory.orderStatus", -1] },
                    "Delivered",
                  ],
                },
                1,
                0,
              ],
            },
          },
          cancelledOrders: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    { $arrayElemAt: ["$statusHistory.orderStatus", -1] },
                    "Cancelled",
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const userStats = await userModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalGeneralUsers: {
            $sum: { $cond: [{ $eq: ["$role", "GENERAL"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const stats = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const orderData = orderStats.find((item) => item._id === month) || {
        totalOrders: 0,
        successfulOrders: 0,
        cancelledOrders: 0,
      };
      const userData = userStats.find((item) => item._id === month) || {
        totalGeneralUsers: 0,
      };

      return {
        month: `Tháng ${month}`,
        totalOrders: orderData.totalOrders,
        successfulOrders: orderData.successfulOrders,
        cancelledOrders: orderData.cancelledOrders,
        totalGeneralUsers: userData.totalGeneralUsers,
      };
    });

    res.json({
      message: "Dữ liệu thống kê lấy thành công",
      error: false,
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getChartData;
