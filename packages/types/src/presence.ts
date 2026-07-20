export interface CursorPosition {
  lineNumber: number;
  column: number;
}

export interface SelectionRange {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export interface PresenceState {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  color: string;
  fileId: string;
  cursor: CursorPosition | null;
  selection: SelectionRange | null;
  lastSeen: number;
}
