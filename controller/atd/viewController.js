const Atd = require("../../model/atd.model.js");

const viewController = async (req, res) => {
    try {
        const { month, year } = req.body;
        const { userId } = req.params;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: "Month and year are required"
            });
        }

        // Ensure month is always two digits
        const formattedMonth = month.toString().padStart(2, '0');

        // Calculate the start and end dates as strings
        const formattedStartDate = `${year}-${formattedMonth}-01`;
        const formattedEndDate = `${year}-${formattedMonth}-31`;

        const queryUserId = userId || req.user._id;

        const attendanceRecords = await Atd.find({
            userId: queryUserId,
            date: { $gte: formattedStartDate, $lte: formattedEndDate }
        });

        res.status(200).json({
            success: true,
            message: "Fetched attendance records successfully",
            attendanceRecords
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching attendance records"
        });
    }
};

module.exports = { viewController };
