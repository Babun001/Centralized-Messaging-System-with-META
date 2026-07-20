import type { Request, Response } from "express";

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

export const receiveWebhook = (
    req: Request,
    res: Response
): void => {
    console.log("\n==============================");
    console.log("NEW FACEBOOK WEBHOOK EVENT");
    console.log("==============================");

    console.log("Headers:");
    console.dir(req.headers, { depth: null });

    console.log("\nBody:");
    console.dir(req.body, { depth: null });

    // If it's a Messenger message, print useful fields
    if (req.body.object === "page") {
        const entries = req.body.entry || [];

        for (const entry of entries) {
            const messagingEvents = entry.messaging || [];

            for (const event of messagingEvents) {
                console.log("\n========= MESSAGE =========");
                console.log("Sender ID:", event.sender?.id);
                console.log("Recipient ID:", event.recipient?.id);
                console.log("Timestamp:", event.timestamp);

                if (event.message) {
                    console.log("Message ID:", event.message.mid);
                    console.log("Message:", event.message.text);
                }

                if (event.postback) {
                    console.log("Postback Payload:", event.postback.payload);
                }
            }
        }
    }

    res.sendStatus(200);
};