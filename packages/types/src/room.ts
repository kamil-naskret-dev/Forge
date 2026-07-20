import type { UserPublic } from './auth';

export type RoomRole = 'OWNER' | 'EDITOR' | 'VIEWER';
export type RoomVisibility = 'PUBLIC' | 'PRIVATE';

export interface Room {
  id: string;
  name: string;
  description: string | null;
  language: string;
  visibility: RoomVisibility;
  inviteCode: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomMember {
  id: string;
  roomId: string;
  userId: string;
  role: RoomRole;
  joinedAt: string;
  user: UserPublic;
}

export interface RoomWithMembers extends Room {
  members: RoomMember[];
}

export interface CreateRoomDto {
  name: string;
  description?: string;
  language?: string;
  visibility?: RoomVisibility;
}
