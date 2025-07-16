const Atd = require("../../model/atd.model");
const mongoose = require("mongoose");

const gradeController = async (req, res) => {
   
    try {
        const attendanceGrouped = await Atd.aggregate([
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
                    _id: {
                        userId: "$userId",
                        month: { $dateToString: { format: "%Y-%m", date: { $dateFromString: { dateString: "$date" } } } }
                    },
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
            },
            {
                $group: {
                    _id: "$_id.userId",
                    monthlyAttendance: {
                        $push: {
                            month: "$_id.month",
                            totalDays: "$totalDays",
                        }
                    },
                    userInfo: { $first: "$userInfo" }
                }
            },
            {
                $project: {
                    _id: 1,
                    userInfo: 1,
                    monthlyAttendance: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Attendance records grouped by user successfully.",
            data: attendanceGrouped
        });
    } catch (error) {
        console.error("Error in gradeController:", error);
        res.status(500).json({
            success: false,
            message: "Server error while assign grade "
        });
    }
};

module.exports = { gradeController };
