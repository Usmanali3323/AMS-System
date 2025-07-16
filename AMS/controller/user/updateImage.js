const { updateImage, getPublicIdFromUrl } = require("../../cloudinary");
const User = require("../../model/user.model");

const UpdateImageController = async (req, res) => {
    try {
        const imagePath = req.file?.path;
          console.log(imagePath);
          
        if (!imagePath) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded.",
            });
        }

        // Fetch the user details
        const userDetail = await User.findById(req.user._id);
        if (!userDetail) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Extract the public ID from the current image URL
        const public_id = getPublicIdFromUrl(userDetail.imageUrl);

        // Update the image on Cloudinary
        const response = await updateImage(imagePath, public_id);

        // Ensure the response contains the updated image URL
        if (!response?.url) {
            return res.status(500).json({
                success: false,
                message: "Failed to update the image on Cloudinary.",
            });
        }

        // Update user's image URL in the database
        const updatedUser = await User.findByIdAndUpdate(
            userDetail._id,
            { imageUrl: response.url },  // Update the imageUrl field
            { new: true }  // Return the updated document
        );

        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                message: "Failed to update user's image in the database.",
            });
        }

        res.status(200).json({
            success: true,
            imageUrl: updatedUser.imageUrl,
            message: "Profile image updated successfully.",
        });
    } catch (error) {
        console.error("Error updating profile image:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating profile image.",
        });
    }
};

module.exports = { UpdateImageController };
