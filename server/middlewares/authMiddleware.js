const { clerkClient } = require("@clerk/express");

// Middleware to protect educator-only routes
const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const response = await clerkClient.users.getUser(userId);

    if (response.publicMetadata.role !== "educator") {
      return res.json({
        success: false,
        message: "Unauthorized access, Educator role required",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = protectEducator;
