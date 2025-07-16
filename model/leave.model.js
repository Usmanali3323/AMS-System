const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    leaveType: {
        type: String,
        required: true,
        enum: ["sick leave", "vacation leave", "casual leave"], // Add other types as needed
    },
    startDate: {
        type: String, // Store start date as a string
        required: true
    },
    endDate: {
        type: String, // Store end date as a string
        required: true
    },
    status: {
        type: String,
        default: "pending", // Can be "approved" or "rejected"
        enum: ["pending", "approved", "rejected"]
    },
}, { timestamps: true });

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
