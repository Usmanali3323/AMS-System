const Atd = require("../../model/atd.model");

const UpdateAtdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, atd } = req.body;
    console.log(userId);
    console.log(date);
    console.log(atd);
    
    
    

    // Validate the required fields
    if (!userId || !date || !atd) {
      return res.status(400).json({
        success: false,
        message: "UserId, date, and atd status are required",
      });
    }

    // Update the attendance
    const updateAtd = await Atd.findOneAndUpdate(
      { userId, date },
      { $set: { atd } },
      { new: true } // This option returns the updated document
    );

    // Check if the attendance was found and updated
    if (!updateAtd) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    // Successful response
    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: updateAtd, // Return the updated attendance
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = UpdateAtdController;
