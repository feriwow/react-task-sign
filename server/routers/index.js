const express = require('express')
const UserController = require('../controller/userController')
const router = express.Router()
const auth = require("../middleware/auth")

router.post("/register", UserController.register)
router.get("/verify-email/:token", UserController.verifyEmail);
router.post("/resend-verification-email", UserController.resendVerificationEmail)
router.post("/login", UserController.login)
router.post('/google-login', UserController.googleLogin);
router.post('/fb-login', UserController.facebookLogin);
router.use(auth)
router.post("/logout", UserController.logout)
router.post("/resetPassword", UserController.resetPassword)
router.post("/change-name", UserController.changeName)
router.get("/profile", UserController.profile)
router.get("/user-activity", UserController.getUserActivity);
router.get("/user-analytics", UserController.getUserAnalytics)


module.exports = router
