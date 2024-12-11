const bcrypt = require("bcryptjs");
const userModel = require("../../model/userModel");
const jwt = require("jsonwebtoken");
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

async function userSignIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email và mật khẩu không được bỏ trống.",
        success: false,
        error: true,
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Định dạng email không hợp lệ.",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng.",
        success: false,
        error: true,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng.",
        success: false,
        error: true,
      });
    }

    const tokenData = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: 60 * 60 * 8,
    });

    const tokenOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("token", token, tokenOptions).status(200).json({
      message: "Đăng nhập thành công",
      token: token,
      role: user.role,
      success: true,
      error: false,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = userSignIn;
