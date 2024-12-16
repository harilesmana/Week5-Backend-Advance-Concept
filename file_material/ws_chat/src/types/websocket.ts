// src/types/websocket.ts
export interface ChatMessage {
  type: 'message' | 'join' | 'leave';
  username?: string;
  content?: string;
  timestamp?: Date;
}