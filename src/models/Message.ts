import mongoose,{Schema} from "mongoose";


const messageSchema = new Schema(
{

    conversationId:{
        type:Schema.Types.ObjectId,
        ref:"Conversation",
        required:true
    },


    platform:{
        type:String,
        required:true
    },


    messageId:{
        type:String,
        required:true,
        unique:true
    },


    direction:{
        type:String,
        enum:[
            "incoming",
            "outgoing"
        ],
        required:true
    },


    senderId:{
        type:String,
        required:true
    },


    receiverId:{
        type:String,
        required:true
    },


    content:{
        type:{
            type:String,
            default:"text"
        },

        text:{
            type:String
        }
    }

},
{
    timestamps:true
});


export default mongoose.model(
    "Message",
    messageSchema
);