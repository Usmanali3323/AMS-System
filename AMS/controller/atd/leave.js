const Leave = require("../../model/leave.model.js");
const Atd = require("../../model/atd.model.js");

const leaveController = async (req, res) => {
    try {
        const { leaveType, startDate, endDate } = req.body;

        // Validate required fields
        if (!leaveType || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Leave type, start date, and end date are required"
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        

        // Check if the requested leave dates are in the past
        const today = new Date();
        if (start < today || end < today) {
            return res.status(400).json({
                success: false,
                message: "Leave dates cannot be for past day"
            });
        }

        // Check if start date is before end date
        if (start > end) {
            return res.status(400).json({
                success: false,
                message: "Start date must be before end date"
            });
        }

        // Check for overlapping leave requests
        const existingLeave = await Leave.findOne({
            userId: req.user._id,
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (existingLeave) {
            return res.status(409).json({
                success: false,
                message: "Leave request overlaps with an existing leave"
            });
        }

        // Create new leave request
        const newLeave = new Leave({
            userId: req.user._id,
            leaveType,
            startDate: startDate,
            endDate: endDate
        });

        await newLeave.save();


        res.status(201).json({
            success: true,
            message: "Leave requested successfully send ",
            data: newLeave
        });
    } catch (error) {
        console.error("Error in leaveController:", error);
        res.status(500).json({
            success: false,
            message: "Server error while requesting leave"
        });
    }
};

const viewLeaveController=async(req,res)=>{
try {
    console.log("user : "+req.user?._id);
    if(req.user?._id){
     const userLeaveRecord = await Leave.find({userId: req.user._id});
     if(!userLeaveRecord){
        res.status(404).json({
            success:false,
            message:"Not Leave Record Found"
        })
     }
     res.status(200).json({
        success:true,
        leaves:userLeaveRecord,
        message:"Leave Record Found Successfully"
    })
    }
} catch (error) {
    res.status(500).json({
        success:false,
        message:"server Error in View Leave Requuest"
    })
}
}

module.exports = { leaveController,viewLeaveController };
