// infra/socket/socket.ts

import { Server } from 'socket.io';

let io: Server;

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket Connected:', socket.id);

    socket.on('assignment:join', (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);

      console.log(`${socket.id} joined assignment:${assignmentId}`);
    });

    socket.on('assignment:leave', (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }

  return io;
}
