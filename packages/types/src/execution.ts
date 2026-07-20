export type ExecutionStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR';

export interface ExecutionRequest {
  roomId: string;
  fileId: string;
  language: string;
  stdin?: string;
}

export interface ExecutionResult {
  id: string;
  roomId: string;
  fileId: string;
  language: string;
  status: ExecutionStatus;
  stdout: string | null;
  stderr: string | null;
  compileOut: string | null;
  exitCode: number | null;
  timeMs: number | null;
  memoryKb: number | null;
  createdAt: string;
  finishedAt: string | null;
}
