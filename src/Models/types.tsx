// src/types.ts
export interface User {
    token: string;
    id: number;
    username: string;
    isOnline: boolean;
    lastSeen?: string;
}

// types.ts

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    text: string;
    timestamp: string;
    isRead: boolean;
    fileUrl?: string; // 💡 Yeni: Dosya bağlantısı
    fileName?: string; // 💡 Yeni: Dosya adı
}



export const dummyUsers: User[] = [

];

