import express from "express";
import authen from '../middleware/auth.js'
import { accesChat, getChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", authen, accesChat);
router.get("/", authen, getChats);
router.post("/group", authen, createGroupChat);
router.put("/rename", authen, renameGroup);
router.put('/groupremove', authen, removeFromGroup);
router.put("/groupadd", authen, addToGroup);

export default router;
