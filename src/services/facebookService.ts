import axios from "axios";


interface SendMessagePayload {
    recipientId: string;
    message: string;
}


export const sendFacebookMessage = async (
    data: SendMessagePayload
) => {

    try {

        const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;
        const url = `https://graph.facebook.com/v23.0/me/messages`;

        const response = await axios.post(
            url,
            {
                recipient: {
                    id: data.recipientId
                },
                message: {
                    text: data.message
                }
            },
            {
                params: {
                    access_token: pageAccessToken
                }
            }
        );
        return response.data;
    } catch (error: any) {
        console.error(
            "Facebook Send Message Error:",
            error.response?.data || error.message
        );
        throw error;
    }
};