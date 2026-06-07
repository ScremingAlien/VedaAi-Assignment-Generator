// shared/socket-events.ts

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',

  JOIN_ASSIGNMENT: 'assignment:join',

  LEAVE_ASSIGNMENT: 'assignment:leave',

  STATUS_UPDATED: 'assignment:status',

  COMPLETED: 'assignment:completed',

  FAILED: 'assignment:failed',
} as const;
