const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post("/signup", UserController.user_signup);

router.post("/login/email", UserController.user_login_email);

router.post("/login/admin", UserController.admin_login);

// router.post("/forgotPassword", UserController.forgotPassword);

// router.post("/resetPassword", checkAuth, UserController.resetPassword);

router.post("/changePassword", checkAuth, UserController.changePassword);

router.get("/:userId", checkAuth, UserController.Single_user_details);

router.get("/list/all", UserController.getAllUSERDATA);

router.get("/company/list", UserController.getCompanyUsers);

router.post("/update", checkAuth, UserController.user_update);

router.post("/search", UserController.search_user);

router.post("/send/notification", UserController.notify_user);

router.post("/sentotp", UserController.user_mobile_send_otp);

router.post("/verifyotp", UserController.Verify_otp);

router.post("/create/byadmin", UserController.create_com_user_by_admin);

router.post("/bulk/upload", UserController.user_bulk_upload);

router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;