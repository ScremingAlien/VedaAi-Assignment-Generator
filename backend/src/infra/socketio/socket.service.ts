// infra/socket/socket.service.ts

import { getIO } from './socket.js';

export class SocketService {
  emitProgress(
    assignmentId: string,
    progress: {
      percent: number;
      step: string;
    },
  ) {
    getIO()
      .to(`assignment:${assignmentId}`)
      .emit('assignment:progress', {
        assignmentId,
        ...progress,
      });
  }

  emitStatus(assignmentId: string, status: string) {
    getIO().to(`assignment:${assignmentId}`).emit('assignment:status', {
      assignmentId,
      status,
    });
  }

  emitCompleted(assignmentId: string, assessmentId: string) {
    console.log('[SOCKET] assignment:completed', {
      assignmentId,
      assessmentId,
    });

    getIO().to(`assignment:${assignmentId}`).emit('assignment:completed', {
      assignmentId,
      assessmentId,
    });
  }

  emitFailed(assignmentId: string, message: string) {
    getIO().to(`assignment:${assignmentId}`).emit('assignment:failed', {
      assignmentId,
      message,
    });
  }
}
