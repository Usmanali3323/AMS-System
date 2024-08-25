require("dotenv").config();
const cloudinary = require('cloudinary').v2
const fs =require("fs")
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET 
});

console.log(process.env.CLOUDINARY_NAME);
console.log(process.env.CLOUDINARY_KEY);
console.log(process.env.CLOUDINARY_SECRET );

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response);
        
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log("Error coming while uploading file : "+error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

function getPublicIdFromUrl(imageUrl) {
    // Remove the Cloudinary domain and the 'upload/' part from the URL
    let urlParts = imageUrl.split('/');
    
    // Find the index of 'upload' keyword
    const uploadIndex = urlParts.length-1;
    const splitKey = urlParts[uploadIndex].split('.');
    console.log("public Id : "+splitKey[splitKey.length-2]);
    const publicId = splitKey[splitKey.length-2]
    return publicId;
  }
  
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Image deleted successfully:', result);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};

const updateImage = async (newImagePath, publicId) => {
    try {
      const result = await cloudinary.uploader.upload(newImagePath, {
        public_id: publicId,
        overwrite: true, // Ensure the image gets replaced
      });
      fs.unlinkSync(newImagePath);
      return result;
    } catch (error) {
      console.error('Error updating image:', error);
      fs.unlinkSync(newImagePath);
    }
  };
  
module.exports ={uploadCloudinary,deleteImage,getPublicIdFromUrl,updateImage};