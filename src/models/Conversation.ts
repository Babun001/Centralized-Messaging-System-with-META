import mongoose, { Schema } from "mongoose";


const conversationSchema = new Schema({

    contactId: {
        type: Schema.Types.ObjectId,
        ref: "Contact",
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            "open",
            "closed"
        ],
        default: "open"
    },
    unreadCount: {
        type: Number,
        default: 0
    },
    lastMessage: {
        text: String,
        at: Date
    }
},
    {
        timestamps: true
    });


export default mongoose.model(
    "Conversation",
    conversationSchema
);