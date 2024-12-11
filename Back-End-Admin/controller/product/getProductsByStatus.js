const productModel = require("../../model/productModel");

async function getProductsByStatus(req, res) {
  const { status, category } = req.body;
  try {
    const filter = { status: status }; 

    if (category) {
      filter.category = category; 
    }

    const products = await productModel
      .find(filter) 
      .sort({ updatedAt: -1 })
      .exec();

    res.status(200).json({
      data: products,
      success: true,
      error: false,
      message: "Lấy sản phẩm theo trạng thái thành công",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getProductsByStatus;
