const Atd = require("../../model/atd.model.js");

const atdController = async (req, res) => {
    try {
        const { atd } = req.body;

        // Check if attendance is provided
        if (!atd) {
            return res.status(400).json({ 
                success: false,
                message: "Attendance is required"
            });
        }

        console.log(req.user._id);

        // Get today's date in 'YYYY-MM-DD' format
        const today = new Date().toISOString().split('T')[0];

        // Check if attendance has already been marked for today
        const checkAtd = await Atd.findOne({
            userId: req.user._id,
            date: today
        });

        if (checkAtd) {
            return res.status(400).json({
                success: false,
                message: "Attendance already marked"
            });
        }

        // Create a new attendance record
        const markAtd = new Atd({ atd, userId: req.user._id });
        await markAtd.save();

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            data: markAtd
        });
    } catch (error) {
        console.error("Error in atdController:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Server error at ATD"
        });
    }
};

module.exports = { atdController };
