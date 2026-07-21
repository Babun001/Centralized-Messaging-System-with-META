import Contact from "../models/Contact.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";


interface SaveMessageData {
    platform: string;
    senderId: string;
    receiverId: string;
    messageId: string;
    text: string;
}

export const saveIncomingMessage = async (
    data: SaveMessageData
) => {
    // 1. Find or create contact

    let contact = await Contact.findOne({
        platform: data.platform,
        platformUserId: data.senderId
    });

    if (!contact) {

        contact = await Contact.create({
            platform: data.platform,
            platformUserId: data.senderId

        });
    }
    // 2. Find or create conversation

    let conversation = await Conversation.findOne({

        contactId: contact._id,
        platform: data.platform
    });

    if (!conversation) {

        conversation = await Conversation.create({
            contactId: contact._id,
            platform: data.platform
        });
    }

    // 3. Save message

    const message = await Message.create({

        conversationId: conversation._id,
        platform: data.platform,
        messageId: data.messageId,
        direction: "incoming",
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: {
            type: "text",
            text: data.text
        }
    });

    // 4. Update conversation

    conversation.lastMessage = {
        text: data.text,
        at: new Date()

    };
    conversation.unreadCount += 1;
    await conversation.save();
    return message;
};