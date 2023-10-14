import express from "express";
import { signupData, signinData, getalluser } from "../controllers/userController.js";
import authen from "../middleware/auth.js";


const router = express.Router();

router.post("/signup", signupData);
router.post("/signin", signinData);
router.get("/allusers", authen, getalluser)


export default router;