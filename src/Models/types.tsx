// src/types.ts
export interface User {
    id: number;
    username: string;
    isOnline: boolean;
    lastSeen?: string;
}

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    isRead?: boolean;
}


export const dummyUsers: User[] = [

];

