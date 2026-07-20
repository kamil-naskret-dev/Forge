/**
 * Single source of truth for all Socket.io event names.
 * Used by both client (apps/web) and server (apps/api).
 */
export const WsEvents = {
  // Room lifecycle
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',

  // Document sync (Yjs)
  DOC_SYNC: 'doc:sync',
  DOC_UPDATE: 'doc:update',
  DOC_AWARENESS: 'doc:awareness',

  // Presence
  PRESENCE_UPDATE: 'presence:update',
  PRESENCE_STATE: 'presence:state',
  PRESENCE_JOINED: 'presence:joined',
  PRESENCE_LEFT: 'presence:left',

  // File tree
  FILE_CREATED: 'file:created',
  FILE_RENAMED: 'file:renamed',
  FILE_DELETED: 'file:deleted',

  // AI streaming
  AI_STREAM_START: 'ai:stream:start',
  AI_STREAM_CHUNK: 'ai:stream:chunk',
  AI_STREAM_END: 'ai:stream:end',
  AI_STREAM_ERROR: 'ai:stream:error',

  // Code execution
  EXECUTION_STARTED: 'execution:started',
  EXECUTION_RESULT: 'execution:result',

  // Chat
  CHAT_MESSAGE: 'chat:message',
  CHAT_MESSAGE_NEW: 'chat:message:new',
  CHAT_REACT: 'chat:react',
  CHAT_REACT_UPDATE: 'chat:react:update',
} as const;

export type WsEvent = (typeof WsEvents)[keyof typeof WsEvents];
