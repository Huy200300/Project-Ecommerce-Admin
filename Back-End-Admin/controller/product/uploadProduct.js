const productModel = require("../../model/productModel");
const MobileSpecs = require("../../model/mobileSpecs");
const AccessorySpecs = require("../../model/accessorySpecs");
const LaptopSpecs = require("../../model/laptopSpecs");
const TabletSpecs = require("../../model/tabletSpecs");
const WatchesSpecs = require("../../model/watchSpecs");

async function uploadProduct(req, res) {
  const { specifications, specificationsModel } = req.body;
  try {
    let specificationsDoc;
    if (specificationsModel === "mobiles") {
      specificationsDoc = await MobileSpecs.create(specifications);
    } else if (specificationsModel === "accessory") {
      specificationsDoc = await AccessorySpecs.create(specifications);
    } else if (specificationsModel === "laptop") {
      specificationsDoc = await LaptopSpecs.create(specifications);
    } else if (specificationsModel === "ipad") {
      specificationsDoc = await TabletSpecs.create(specifications);
    } else if (specificationsModel === "watches") {
      specificationsDoc = await WatchesSpecs.create(specifications);
    }

    console.log(specificationsDoc);

    const product = new productModel({
      ...req.body,
      specificationsRef: specificationsDoc._id,
      specificationsModel,
      status: "Pending",
    });
    const saveProduct = await product.save();
    res.status(200).json({
      data: saveProduct,
      success: true,
      error: false,
      message: "Product saved successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = uploadProduct;
