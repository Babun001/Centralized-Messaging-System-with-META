import type { Request, Response } from "express";
import { sendFacebookMessage } from "../services/facebookService.js";

export const replyMessage = async (
    req: Request,
    res: Response
) => {

    try {
        const {
            recipientId,
            message
        } = req.body;

        const result = await sendFacebookMessage({
            recipientId,
            message
        });

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to send message"
        });
    }
};