const mongoose = require('mongoose');
require('dotenv').config();

const DbConn = async()=>{
try {
    const db = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DBNAME}`);
    console.log(`Connection Establish with Mongodb ${db.connect.host}`);
} catch (error) {
    console.log(" Error in MONGODB Connection ",error);
    process.exit(1);
}
}

module.exports=DbConn