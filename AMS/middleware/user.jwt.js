require("dotenv").config();
const Jwt = require("jsonwebtoken");
const User = require("../model/user.model.js");

const verifyJwt = async (req, res, next) => {
    try {
        console.log("it;s working ");
        const accessToken = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        console.log(accessToken);
        // Check if the access token is provided
        if (!accessToken) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        console.log("secret key : "+process.env.ACCESS_TOKEN);
        // Verify the token
        const decodeToken = Jwt.verify(accessToken, process.env.ACCESS_TOKEN);
        if (!decodeToken) {
            return res.status(403).json({ success: false, message: "Invalid token" });
        }

        // Find the user by ID from the token
        const user = await User.findById(decodeToken._id).select("-password -refreshToken");
        if (!user) {
            return res.status(403).json({ success: false, message: "Invalid token" });
        }

        // Attach the user to the request object

        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(500).json({ success: false, message: "Server error during authentication" });
    }
};

module.exports = { verifyJwt };
