const orderModel = require("../../model/orderModel");

async function getRevenuePerMonth(req, res) {
  try {
    const revenueData = await orderModel.aggregate([
      // Bước 1: Chọn thông tin năm, tháng và tính toán doanh thu (quantity * sellingPrice + shipping)
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          totalRevenue: {
            $add: [
              {
                $sum: {
                  $map: {
                    input: "$productDetails",
                    as: "product",
                    in: {
                      $multiply: [
                        "$$product.quantity",
                        "$$product.sellingPrice",
                      ],
                    }, // Tính doanh thu từ sản phẩm
                  },
                },
              },
              {
                $sum: "$shippingDetails.shippingAmount", // Tổng phí vận chuyển
              },
            ],
          },
        },
      },
      // Bước 2: Nhóm theo năm và tháng, tính tổng doanh thu
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalRevenue: { $sum: "$totalRevenue" }, // Tính tổng doanh thu
        },
      },
      // Bước 3: Sắp xếp kết quả theo năm và tháng
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);


    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

    const revenueByMonth = allMonths.map((month) => {
      const monthData = revenueData.find((item) => item._id.month === month);
      return {
        month,
        totalRevenue: monthData ? monthData.totalRevenue : 0, 
      };
    });

    res.json({
      message: "revenueData",
      error: false,
      success: true,
      data: revenueByMonth,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getRevenuePerMonth;
