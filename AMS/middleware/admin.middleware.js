const verifyAdmin=async(req,res,next)=>{
    try {
        console.log(req.user.admin);
        if(req.user?.admin){
            next();
        }else{
            return res.status(401).json({
                success:false,
                message:"unauthorize access"
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"server error at admin middleware"
        })
    }
}
module.exports=verifyAdmin