import type { UserPublic } from './auth';

export type SnapshotType = 'AUTO' | 'MANUAL' | 'RESTORE';

export interface Snapshot {
  id: string;
  roomId: string;
  userId: string;
  label: string | null;
  type: SnapshotType;
  createdAt: string;
  user: UserPublic;
}

export interface SnapshotDiff {
  before: string;
  after: string;
}

export interface CreateSnapshotDto {
  label?: string;
}
