import  type{ Request, Response } from "express";

export const verifyWebhook = (
    req: Request,
    res: Response
): void => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (
        mode === "subscribe" &&
        token === process.env.VERIFY_TOKEN
    ) {
        console.log("Webhook verified");
        res.status(200).send(challenge);
        return;
    }

    res.sendStatus(403);
};

export const receiveWebhook = (
    req: Request,
    res: Response
): void => {
    console.log("Webhook Event");
    console.dir(req.body, { depth: null });

    res.sendStatus(200);
};