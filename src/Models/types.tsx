// src/types.ts
export interface User {
    id: number;
    username: string;
    isOnline: boolean;
    lastSeen?: string;
    email?: string;
    role?: string;
}

// types.ts

export interface Message {
    id: number;
    messageId?: number;
    senderId: number;
    senderName?: string;
    receiverId: number;
    text: string;
    timestamp: string;
    isRead: boolean;
    fileUrl?: string; // 💡 Yeni: Dosya bağlantısı
    fileName?: string; // 💡 Yeni: Dosya adı
}



export const dummyUsers: User[] = [

];

