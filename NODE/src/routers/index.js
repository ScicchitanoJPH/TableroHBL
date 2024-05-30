import { Router }     from "express";

import userRouter from "./login.routes.js"
import registerRouter from "./register.routes.js"
//import {userLogin, signUp,showLogin,showRegister} from "../controllers/auth.controller.js"
import tableroRouter from "./tablero.routes.js"

import deviceRouter from "./device.router.js"

import eventsRouter from "./event.router.js"

const router = Router();

router.use("/login",userRouter)

router.use("/register",registerRouter)

router.use("/devices",deviceRouter)

router.use("/events",eventsRouter)

router.use("/tableros",tableroRouter);

export default router;