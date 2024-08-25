const app =require("./app.js");
const DbConn = require('./db/db.js');
const Atd = require('./model/atd.model.js')
const cron = require("node-cron");


cron.schedule("58 23 * * *", async () => {
    try {
        await Atd.updateMany(
            {
                atd: { $ne: "P", $ne: "L" } // Find records not marked as Present or Leave
            },
            {
                $set: { atd: "A" } // Update them to "Absent"
            }
        );
        console.log("Updated all unmarked attendance records to 'Absent'.");
    } catch (error) {
        console.error("Error updating attendance records:", error);
    }
});

DbConn().then(()=>{
    app.on('error',()=>{
        console.log(`Error during establishing DB Connection `);
    });
    app.listen(process.env.PORT,()=>{
        console.log(`APPLICATION WORKING ON ${process.env.PORT}`);
    })
})