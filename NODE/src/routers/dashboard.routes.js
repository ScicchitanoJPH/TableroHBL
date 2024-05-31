const express = require('express');
const Router = express.Router;  // Destructuring assignment for brevity

const {authenticateUser} = require("../middleware/checkAuth.middleware.js")
const controller = require('../controllers/dashboard.controller.js')

//const {showLogin,userLogin} = new AuthController()
const router = Router()
router.use(authenticateUser)
router.get("/",controller.showDashboard)
router.post("/:uid",controller.createDashBoard)
//router.post("/",controller.userLogin);




module.exports = router