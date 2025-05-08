
export interface IChat {
    _id?: string;
    participant1?: string;
    participant2?: string;
    participant2Name?: string;
    participant2ProfileUrl?: string;
    participant1Role?: 'admin';
    participant2Role?: 'user' | 'collector';
    lastMessage?: string;
    isTyping?: boolean;
    isOnline?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    unreadCount?: number;
}

export interface IMessage {
    _id: string;
    chatId: string;
    message: string;
    timestamp: Date;
    senderId: string;
    receiverId: string;
    isRead?: boolean;
}

