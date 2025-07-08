// services/sendMessageApi.ts
import axios from 'axios';
import { apiConfig } from '../connection';
import type { MessageItem } from './getMessagesApi';

export const sendMessageApi = async (
    text: string,
    senderId: number,
    receiverId: number,
): Promise<MessageItem> => {
    console.log({
        text,
        senderId,
        receiverId,
    },);





    const response = await axios.post(
        apiConfig.connectionString + 'Message/SendMessage',
        {
            text,
            senderId,
            receiverId,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*"
            }
        }
    );

    return response.data;
};
