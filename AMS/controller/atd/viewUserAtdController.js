const Atd = require("../../model/atd.model");
const User = require("../../model/user.model");

const viewUserAtdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { start, end } = req.body;

    console.log(typeof(start));
    console.log(end);
    
    

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Validate start and end dates
    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: "Start and end dates are required",
      });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find attendance records for the user within the date range
    const atd = await Atd.find({
      userId,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    // Check if attendance records exist
    if (!atd || atd.length === 0) {
      return res.status(200).json({
        success: true,
        user,
        atd:[],
        message: "Attendance not found for the given date range",
      });
    }

    // Return success response with attendance and user data
    res.status(200).json({
      success: true,
      atd,
      user,
      message: "Attendance records found successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error at viewUserAtdController",
    });
  }
};

module.exports = viewUserAtdController;
