export type FileType = 'FILE' | 'FOLDER';

export interface FileNode {
  id: string;
  roomId: string;
  parentId: string | null;
  name: string;
  type: FileType;
  language: string | null;
  path: string;
  createdAt: string;
  updatedAt: string;
  children?: FileNode[];
}

export interface CreateFileDto {
  name: string;
  type: FileType;
  parentId?: string | null;
}
