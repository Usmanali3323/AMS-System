const Atd = require("../../model/atd.model.js")

const updateRecordController = async(req,res)=>{
    const {date,userId,atd}=req.body;
    if(!date || !userId){
        return res.status(400).json({
            success:false,
            message:"Date and userId required"
        })
    }
    const updateAtdRecord = await Atd.findOneAndUpdate({date,userId},{atd},{new:true,upsert:true});
    if(!updateAtdRecord){
        return res.status(400).json({
            success:false,
            message:"Record not found"
        })
    }
    res.status(200).json({
        success:false,
        updateAtdRecord,
        message:"successfully updated"
    })
}

module.exports={updateRecordController}