import express from "express"
import { getMsgsForConversation } from "../controller/chat.controller.js"
const router = express.Router();

router.get('/', getMsgsForConversation);

export default router;