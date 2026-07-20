export type AiCommand = '/explain' | '/refactor' | '/fix' | '/test' | '/docs';

export interface AiStreamRequest {
  command: AiCommand;
  selectedText: string;
  fullFileContent: string;
  language: string;
  fileId: string;
  roomId: string;
}

export interface AiStreamChunk {
  sessionId: string;
  text: string;
}

export interface AiStreamEnd {
  sessionId: string;
  fullText: string;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  command?: AiCommand;
  createdAt: string;
}
