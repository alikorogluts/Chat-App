export interface loginResponse {
    user: {
        id: number;
        username: string;
        token: string;
    }
}

export interface registerResponse {
    message: string
    userId: number
    userName: string
}
export interface InboxItem {
    senderId: number;
    senderUsername: string;
    senderOnline: boolean;
    lastMessage: string;
    sendTime: string;
    isRead: boolean;
    unreadCount: number;
    fileUrl?: string; // 💡 Yeni: Dosya bağlantısı
    fileName?: string;
}