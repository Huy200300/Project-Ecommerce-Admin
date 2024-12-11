const userModel = require("../../model/userModel");

async function updateUserRole(req, res) {
  try {
    const userId = req.user._id;
    const { id, newRole } = req.body;

    const adminUser = await userModel.findById(userId);

    if (!adminUser) {
      return res.status(404).json({
        message: "Người dùng không tồn tại.",
        error: true,
        success: false,
      });
    }

    if (adminUser.role !== "ADMIN") {
      return res.status(403).json({
        message: "Bạn không có quyền thay đổi vai trò người dùng.",
        error: true,
        success: false,
      });
    }

    const result = await userModel.findByIdAndUpdate(
      id,
      { role: newRole },
      { new: true }
    );
    console.log("User role updated:", result);
    res.status(200).json({
      data: result,
      error: false,
      success: true,
      message: "Đã thay đổi role của user " + result.name,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = updateUserRole;
