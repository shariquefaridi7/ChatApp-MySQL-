import express from 'express';
import authen from '../middleware/auth.js';
import { sendMessage, allMessages } from '../controllers/messageController.js';

const router = express.Router();

router.post("/", authen, sendMessage);
router.get("/:chatId", authen, allMessages);

export default router;