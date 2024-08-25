const Atd = require("../../model/atd.model");
const Leave = require("../../model/leave.model");

const leaveApprovalController = async (req, res) => {
    try {
        const { approval, _id } = req.body;

        // Validate input
        if (!approval || !_id) {
            return res.status(400).json({
                success: false,
                message: "Leave approval and _id are required."
            });
        }

        // Find the leave request and update its status
        const leaveRequest = await Leave.findByIdAndUpdate(
            _id,
            { $set: { status: approval } },
            { new: true } 
        );
        
        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found."
            });
        }

        // Handle leave approval
        if (approval === "accepted") {
            const { userId, startDate, endDate } = leaveRequest;

            // Convert startDate and endDate to Date objects
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Iterate through the date range and upsert attendance records
            let currentDate = new Date(start);
            while (currentDate <= end) {
                const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
                
                // Get the day of the week (e.g., 'Monday', 'Tuesday')
                const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' });

                // Find and update or insert attendance record for this date
                await Atd.findOneAndUpdate(
                    { userId, date: formattedDate },
                    { 
                        $set: { 
                            atd: "L", 
                            day: dayOfWeek // Add the day to the attendance record
                        } 
                    },
                    { upsert: true, new: true } // Create a new record if it doesn't exist
                );

                // Increment the current date by one day
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        res.status(200).json({
            success: true,
            message: "Successfully handled leave request."
        });
    } catch (error) {
        console.error("Error in leaveApprovalController:", error);
        res.status(500).json({
            success: false,
            message: "Server error during leave approval."
        });
    }
};




const GetAllLeavesRequest = async (req, res) => {
    try {
        const allLeaves = await Leave.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $group: {
                    _id: "$userId",
                    user: {
                        $first: {
                            _id: "$userDetails._id",
                            fullName: "$userDetails.fullName",
                            email: "$userDetails.email",
                            gender: "$userDetails.gender",
                            imageUrl: "$userDetails.imageUrl",
                            admin: "$userDetails.admin",
                            reg_date: "$userDetails.reg_date"
                        }
                    },
                    leaveRequests: {
                        $push: {
                            _id:"$_id",
                            leaveType: "$leaveType",
                            startDate: "$startDate",
                            endDate: "$endDate",
                            status: "$status",
                            createdAt: "$createdAt",
                            updatedAt: "$updatedAt"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0, // Optionally remove _id if not needed
                    user: {
                        _id: 1,
                        fullName: 1,
                        email: 1,
                        gender: 1,
                        imageUrl: 1,
                        admin: 1,
                        reg_date: 1,
                        leaveRequests: "$leaveRequests"
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Get All Leave requests Successfully",
            data: allLeaves
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error getting all leave requests",
            error: error.message
        });
    }
};


  
module.exports = { leaveApprovalController, GetAllLeavesRequest };
