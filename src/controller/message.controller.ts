import type { Request, Response } from "express";
import { sendFacebookMessage } from "../services/facebookService.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { getIO } from "../socket.js";


// GET /api/messages/conversations
// List every conversation, newest activity first, with the contact info
// needed to render a conversation list in the dashboard.
export const getConversations = async (
    req: Request,
    res: Response
) => {

    try {

        const conversations = await Conversation.find()
            .populate("contactId")
            .sort({ "lastMessage.at": -1, updatedAt: -1 });

        res.status(200).json({
            success: true,
            data: conversations
        });

    } catch (error) {

        console.error("Failed to fetch conversations:", error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch conversations"
        });

    }

};


// GET /api/messages/conversations/:conversationId
// Full message history for one conversation, oldest first.
// Also clears the unread count since the admin is now viewing it.
export const getConversationMessages = async (
    req: Request,
    res: Response
) => {

    try {

        const { conversationId } = req.params;

        const messages = await Message.find({ conversationId } as any)
            .sort({ createdAt: 1 });

        await Conversation.findByIdAndUpdate(conversationId, {
            unreadCount: 0
        });

        res.status(200).json({
            success: true,
            data: messages
        });

    } catch (error) {

        console.error("Failed to fetch conversation messages:", error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch conversation messages"
        });

    }

};


// POST /api/messages/reply
// Admin only sends { conversationId, message }. The actual platform
// recipient id is looked up server-side from the conversation's contact,
// so the frontend never needs to know or handle it.
export const replyMessage = async (
    req: Request,
    res: Response
) => {

    try {

        const { conversationId, message } = req.body;

        if (!conversationId || !message) {
            res.status(400).json({
                success: false,
                error: "conversationId and message are required"
            });
            return;
        }

        const conversation = await Conversation.findById(conversationId)
            .populate("contactId");

        if (!conversation) {
            res.status(404).json({
                success: false,
                error: "Conversation not found"
            });
            return;
        }

        const contact: any = conversation.contactId;
        const recipientId = contact?.platformUserId;

        if (!recipientId) {
            res.status(400).json({
                success: false,
                error: "This conversation's contact has no platform id on file"
            });
            return;
        }

        const result = await sendFacebookMessage({
            recipientId,
            message
        });

        const savedMessage = await Message.create({
            conversationId: conversation._id,
            platform: conversation.platform,
            messageId:
                result?.message_id ||
                `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            direction: "outgoing",
            senderId: "page",
            receiverId: recipientId,
            content: {
                type: "text",
                text: message
            }
        });

        conversation.lastMessage = {
            text: message,
            at: new Date()
        } as any;
        await conversation.save();

        const io = getIO();
        io.emit("new_message", savedMessage);

        res.status(200).json({
            success: true,
            data: savedMessage
        });

    } catch (error) {

        console.error("Failed to send reply:", error);

        res.status(500).json({
            success: false,
            error: "Failed to send message"
        });

    }

};
