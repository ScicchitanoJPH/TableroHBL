const express = require('express');
const Router = express.Router;  // Destructuring assignment for brevity

const authRouter = require('./auth.routes.js');


// Assuming auth.controller.js is in the same directory:
// const { userLogin, signUp, showLogin, showRegister } = require('../controllers/auth.controller.js');

const deviceRouter = require('./device.routes.js');
const eventsRouter = require('./event.routes.js');
const boardsRouter = require('./board.routes.js');
const { authenticateUser } = require('../middleware/checkAuth.middleware.js');

const router = Router();

router.use("/auth",authRouter)

router.use("/devices",deviceRouter)

router.use("/events",eventsRouter)

router.use("/boards",authenticateUser,boardsRouter)


module.exports = router