import type { UserPublic } from './auth';

export type MessageType = 'TEXT' | 'LINE_REACTION' | 'SYSTEM';

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  type: MessageType;
  lineRef: number | null;
  fileId: string | null;
  replyToId: string | null;
  reactions: Record<string, string[]>;
  createdAt: string;
  editedAt: string | null;
  user: UserPublic;
}

export interface SendMessageDto {
  content: string;
  replyToId?: string;
}

export interface ReactToMessageDto {
  messageId: string;
  emoji: string;
}
