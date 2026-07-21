import { Router } from "express";
import {
    verifyWebhook,
    receiveWebhook,
} from "../controller/webhook.controller.js";

import {
    replyMessage
} from "../controller/message.controller.js";

const router = Router();

router.get("/", verifyWebhook);
router.post("/", receiveWebhook);

router.post("/reply",replyMessage);

export default router;