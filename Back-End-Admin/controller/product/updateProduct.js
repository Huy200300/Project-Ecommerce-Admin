const productModel = require("../../model/productModel");
const MobileSpecs = require("../../model/mobileSpecs");
const AccessorySpecs = require("../../model/accessorySpecs");
const LaptopSpecs = require("../../model/laptopSpecs");
const TabletSpecs = require("../../model/tabletSpecs");
const WatchesSpecs = require("../../model/watchSpecs");

const specificationsMapping = {
  mobiles: MobileSpecs,
  accessory: AccessorySpecs,
  laptop: LaptopSpecs,
  ipad: TabletSpecs,
  watches: WatchesSpecs,
};

async function updateProduct(req, res) {
  const { id, specifications, specificationsModel } = req.body;
  try {
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    const updatedFields = { ...req.body };

    if (specificationsModel && specificationsMapping[specificationsModel]) {
      const SpecificationsModel = specificationsMapping[specificationsModel];
      let specificationsDoc;

      if (product.specificationsRef) {
        // Cập nhật document nếu đã có specificationsRef
        specificationsDoc = await SpecificationsModel.findByIdAndUpdate(
          product.specificationsRef,
          specifications,
          { new: true }
        );
      } else {
        // Tạo mới document nếu chưa có specificationsRef
        specificationsDoc = await SpecificationsModel.create(specifications);
      }

      updatedFields.specificationsRef = specificationsDoc._id;
      updatedFields.specificationsModel = specificationsModel;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    res.json({
      message: "Product updated successfully",
      success: true,
      error: false,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = updateProduct;
