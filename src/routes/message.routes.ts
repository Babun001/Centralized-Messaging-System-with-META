import { Router } from "express";
import {
    replyMessage,
    getConversations,
    getConversationMessages,
} from "../controller/message.controller.js";

const router = Router();

router.get("/conversations", getConversations);
router.get("/conversations/:conversationId", getConversationMessages);
router.post("/reply", replyMessage);

export default router;
