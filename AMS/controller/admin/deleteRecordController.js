const { deleteImage, getPublicIdFromUrl } = require("../../cloudinary");
const Atd = require("../../model/atd.model");
const Leave = require("../../model/leave.model");
const User = require("../../model/user.model");

const deleteRecordController = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate input
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required to delete record."
            });
        }

        // Delete user record
        const deleteRecord = await User.findByIdAndDelete({_id:userId});
       const publicId = getPublicIdFromUrl(deleteRecord.imageUrl)
       console.log(publicId);
         await deleteImage(publicId);
        
        if (!deleteRecord) {
            return res.status(404).json({
                success: false,
                message: "User record not found."
            });
        }

        // Delete attendance record
        const deleteAtd = await Atd.deleteMany({ userId });
 
        const deleteLeave = await Leave.deleteMany({ userId });

        res.status(200).json({
            success: true,
            deleteRecord,
            deleteAtd,
            deleteLeave,
            message: "Records deleted successfully."
        });

    } catch (error) {
        console.error("Error in deleteRecordController:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting records."
        });
    }
}

module.exports = { deleteRecordController };
