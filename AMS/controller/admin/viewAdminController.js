const Atd = require("../../model/atd.model.js");

const viewAdminController = async (req, res) => {
    const { month,year} = req.query;

    // Validate input
    if (!month || !year) {
        return res.status(400).json({
            success: false,
            message: "month and year are required."
        });
    }

    try {
        const startDate=`${year}-${month}-01`
        const endDate=`${year}-${month}-31`
        // Parse dates
        const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
        const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

        // Aggregate attendance records with user info
        const attendanceGrouped = await Atd.aggregate([
            {
                $match: {
                    date: {
                        $gte: formattedStartDate,
                        $lte: formattedEndDate
                    }
                }
            },
            {
                $lookup: {
                    from: "users", // Name of the users collection
                    localField: "userId",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true // Optional: keep attendance even if user data is missing
                }
            },
            {
                $group: {
                    _id: "$userId",
                    totalDays: { $sum: 1 },
                    attendance: { $push: { date: "$date", atd: "$atd" } },
                    userInfo: {
                        $first: {
                            username: "$userInfo.username",
                            email: "$userInfo.email",
                            fullName: "$userInfo.fullName"
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Attendance records grouped by user successfully",
            data: attendanceGrouped
        });
    } catch (error) {
        console.error("Error in viewAdminController:", error);
        res.status(500).json({
            success: false,
            message: "Server error while grouping attendance records"
        });
    }
};

module.exports = { viewAdminController };
