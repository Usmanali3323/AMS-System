const bcrypt = require("bcrypt")
const User = require("../../model/user.model.js")
const Jwt =require("jsonwebtoken")
const {uploadCloudinary} = require("../../cloudinary.js")

const generateAccessTokenAndRefereshToken = async(userId)=>{
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken("1h");
    const refreshToken = user.generateRefreshToken("1d");
    user.refreshToken=refreshToken;
    user.save({validateBeforeSave:false});
    return {refreshToken,accessToken}
    }


const registerController = async (req, res) => {
    try {
        const { fullName, email, password, gender } = req.body;
        const avatar = req.file?.path; 
        console.log(avatar);
        

        if (!avatar) {
            return res.status(400).send("Profile picture is required");
        }
        else if(!email){
           return res.status(400).send("Email is required");
        } else if(!gender){
           return res.status(400).send("Gender is required");
        }else if(!password){
            return res.status(400).send("Password is required");
        }

        // let checkPassword= await JSON.stringify(password);
        // let trimPassword = checkPassword.trim();
        
        console.log("password length : "+password.length+" password : "+password);
        
        if(password.length < 6){
            return res.status(400).json({success:false,message: "Password must be at least 6 character"});
        }
        const checkUser = await User.findOne({email});
        if(checkUser){
            return res.status(400).json(
                {
                    success:false,
                    message: "email already exist"
                });
        }
        // Convert the image buffer to Base64
        const imageUrl = await uploadCloudinary(avatar);
        console.log("imageUrl : "+imageUrl);
        const hashPassword = await bcrypt.hash(password,10);
    
        const newUser = new User({
            fullName,
            email,
            password:hashPassword,
            gender,
            imageUrl:imageUrl?.url
        });
        await newUser.save();
        const user = await User.findOne({email}).select('-password');

        const { accessToken, refreshToken } = await generateAccessTokenAndRefereshToken(user._id);

        res.set('Content-Type', 'application/json');
        res.status(201).json({
            success: true,
            user:user,
            accessToken,
            refreshToken,
            message:"Register successfully"
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            successs:false,
            message: "Server error, please try again later."
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Email: " + email + ", Password Type: " + typeof password);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist"
            });
        }

        console.log("Stored Password:", user.password);

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            });
        }

        const logginUser = await User.findById(user._id).select("-password -refreshToken");
        
        const { accessToken, refreshToken } = await generateAccessTokenAndRefereshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true 
        };

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                user: logginUser,
                accessToken,
                refreshToken,
                message: "Login sucessfully"
            });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


const refreshAccessToken = async(req,res)=>{
    const incomingRefreshToken = req?.cookie?.refreshToken || req.body?.refreshToken;
    if(!incomingRefreshToken){
       throw new Error(401,"invalid access token");
    }
    const decodeToken = await Jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN);
    if(!decodeToken){
     throw new Error(401,"invalid token");
    }
    const user =await User.findById(decodeToken?._id);
    if(!user){
     throw new Error(401,"Invalid Token");
    }
    console.log(decodeToken);
    if(user?.refreshToken!=incomingRefreshToken){
     throw new Error(401,"Invalid Token");
    }
   const {accessToken,refreshToken}=await generateAccessTokenAndRefereshToken(user?._id);
   const options = {
     httpOnly:true,
     secure:true
   }
   return res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json({accessToken,
    refreshToken,
    message:"successfully login"
   })
 }


module.exports = {registerController,loginController, refreshAccessToken};
