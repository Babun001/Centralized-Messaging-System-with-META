import { Router } from "express";
import {
    verifyWebhook,
    receiveWebhook,
} from "../controller/webhook.controller.js";

const router = Router();

router.get("/", verifyWebhook);

router.post("/", receiveWebhook);

export default router;