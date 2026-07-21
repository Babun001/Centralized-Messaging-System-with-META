import type { Request, Response } from "express";
import { getIO } from "../socket.js";
import type { promises } from "node:dns";
import { saveIncomingMessage } from "../services/messageService.js";

export const verifyWebhook = (
    req: Request,
    res: Response
): void => {

    console.log("\n==============================");
    console.log("META WEBHOOK VERIFICATION");
    console.log("==============================");
    console.log("Query Params:");
    console.log(req.query);


    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("Mode:", mode);
    console.log("Verify Token Received:", token);
    console.log("Expected Verify Token:", process.env.VERIFY_TOKEN);


    if (
        mode === "subscribe" &&
        token === process.env.VERIFY_TOKEN
    ) {
        console.log("✅ Webhook Verified Successfully");
        res.status(200).send(challenge);
        return;
    }


    console.log("❌ Webhook Verification Failed");
    res.sendStatus(403);
};



export const receiveWebhook = async (
    req: Request,
    res: Response
): Promise<void> => {

    console.log("\n==============================");
    console.log("NEW FACEBOOK WEBHOOK EVENT");
    console.log("==============================");
    console.dir(req.body, {
        depth: null
    });



    if (req.body.object === "page") {
        const entries = req.body.entry || [];
        const io = getIO();
        for (const entry of entries) {
            const messagingEvents = entry.messaging || [];
            for (const event of messagingEvents) {
                console.log("\n========= MESSAGE =========");
                const senderId = event.sender?.id;
                const recipientId = event.recipient?.id;
                const timestamp = event.timestamp;
                console.log("Sender ID:", senderId);
                console.log("Recipient ID:", recipientId);
                console.log("Timestamp:", timestamp);
                if (event.message) {
                    const messageData = {
                        platform: "facebook",
                        senderId: event.sender.id,
                        receiverId: event.recipient.id,
                        messageId: event.message.mid,
                        text: event.message.text
                    };


                    try {
                        // Save into MongoDB
                        const savedMessage =
                            await saveIncomingMessage(messageData);
                        console.log(
                            "✅ Message saved:",
                            savedMessage._id
                        );
                        // Send to dashboard
                        const io = getIO();
                        io.emit(
                            "new_message",
                            savedMessage
                        );
                    } catch (error) {
                        console.error(
                            "❌ Failed to save message:",
                            error
                        );
                    }
                }
                if (event.postback) {
                    console.log(
                        "Postback:",
                        event.postback.payload
                    );
                }
            }
        }
    }
    res.sendStatus(200);
};