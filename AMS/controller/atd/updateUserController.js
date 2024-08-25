const User = require("../../model/user.model");

const updateUserController=async(req,res)=>{
    try {
        const {fullName,email,gender} = req.body;
        const {userId}=req.params;
        if(!fullName || !email || !gender){
            return res.status(404).json({
                success:false,
                message:"fullName, email and gender are required"
            })
        }
        const user= await User.findByIdAndUpdate(userId,{fullName,email,gender},{new:true,upsert:true});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        res.status(200).json({
            success:true,
            user:user,
            message:"update user successfully"
        })
    } catch (error) {
        res.status(404).json({
            success:false,
            message:"server error at update User controller"
        })
    }
}
module.exports=updateUserController