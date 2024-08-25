const User = require("../../model/user.model")

const userCount = async(req,res)=>{
    try {
       const userCount = await User.find().countDocuments();  
       res.status(200).json(
        {
            success:true,
            count: userCount
         });     
    } catch (error) {
        res.status(500).json({
            success: false,
            message:'Server error ar user count'
        })
    }
}

module.exports = {userCount}