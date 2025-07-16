const {Router} = require("express");
const upload = require('../middleware/user.multer.js');
const {registerController,loginController , refreshAccessToken} = require('../controller/user/user.register.js')
const {atdController} = require('../controller/atd/atd.js')
const {verifyJwt} = require("../middleware/user.jwt.js")
const verifyAdmin = require("../middleware/admin.middleware.js")
const { leaveController, viewLeaveController } = require("../controller/atd/leave.js");
const { viewController } = require("../controller/atd/viewController.js");
const { viewAdminController } = require("../controller/admin/viewAdminController.js");
const { updateRecordController } = require("../controller/admin/updateRecordController.js");
const { deleteRecordController } = require("../controller/admin/deleteRecordController.js");
const { leaveApprovalController, GetAllLeavesRequest } = require("../controller/admin/leaveApprovalController.js");
const { gradeController } = require("../controller/admin/gradeController.js");
const { userCount } = require("../controller/atd/userCount.js");
const updateUserController = require("../controller/atd/updateUserController.js");
const viewUserAtdController = require("../controller/atd/viewUserAtdController.js");
const UpdateAtdController = require("../controller/atd/UpdateatdController.js");
const { UpdateImageController } = require("../controller/user/updateImage.js");

const router = Router();

router.route('/register').post(upload.single('avatar'),registerController)
router.route('/login').post(loginController);
router.route('/atd').post(verifyJwt, atdController )
router.route("/leave").post( verifyJwt,leaveController);
router.route('/view').post(verifyJwt,viewController)
router.route("/refresh-token").get(refreshAccessToken)
router.route('/view-leave-record').get(verifyJwt,viewLeaveController)
router.route('/update-image').put(upload.single('avatar'),verifyJwt,UpdateImageController)


//admin
router.route('/admin/view').get(verifyJwt,verifyAdmin, viewAdminController)
router.route('/admin/update').patch(verifyJwt,verifyAdmin, updateRecordController)
router.route(`/admin/delete/:userId`).delete(verifyJwt,verifyAdmin, deleteRecordController)
router.route(`/admin/all-leaves`).get(verifyJwt,verifyAdmin,GetAllLeavesRequest)
router.route('/admin/leave-approval').patch(verifyJwt,verifyAdmin,leaveApprovalController )
router.route('/admin/grade').get(verifyJwt,verifyAdmin, gradeController)
router.route('/admin/user-count').get(verifyJwt,verifyAdmin, userCount)
router.route('/admin/view-user/:userId').post(verifyJwt,verifyAdmin,viewUserAtdController);
router.route('/admin/update-user/:userId').put(verifyJwt,verifyAdmin,updateUserController);
router.route('/admin/update-atd/:userId').put(verifyJwt,verifyAdmin,UpdateAtdController)


module.exports=router;