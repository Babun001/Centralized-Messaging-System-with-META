import mongoose, { Schema } from "mongoose";


const contactSchema = new Schema(
    {
        platform: {
            type: String,
            required: true
        },

        platformUserId: {
            type: String,
            required: true
        },

        name: {
            type: String,
            default: null
        },

        profilePic: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    });


// prevent duplicate customer per platform
contactSchema.index(
    {
        platform: 1,
        platformUserId: 1
    },
    {
        unique: true
    }
);


export default mongoose.model(
    "Contact",
    contactSchema
);