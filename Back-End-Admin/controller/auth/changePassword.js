const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

async function changePassword(req, res) {
  try {
    const { _id, email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      throw new Error("Đã tồn tại email này. ");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Mật Khẩu Không Chính Xác");
    }

    const changePassword = await userModel.findByIdAndUpdate(_id, {
      password: hashPassword,
    });
    res.status(200).json({
      data: changePassword,
      success: true,
      error: false,
      message: "Mật khẩu đã được thay đổi thành công.",
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = changePassword;
