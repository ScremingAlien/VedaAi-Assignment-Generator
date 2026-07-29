// features/assignment/hooks/useAssignmentSocket.ts

'use client';

import { useSocket } from '@/lib/provider/socket-provider';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useAssignmentSocket(assignmentId: string) {
  const socket = useSocket();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.emit('assignment:join', assignmentId);

    const onProgress = (payload: any) => {
      queryClient.setQueryData(['assignment-progress', assignmentId], payload);
    };

    const onStatus = (payload: any) => {
      queryClient.invalidateQueries({
        queryKey: ['assignment'],
      });

      queryClient.invalidateQueries({
        queryKey: ['assignments'],
      });
    };

    const onCompleted = (payload: any) => {
      queryClient.invalidateQueries({
        queryKey: ['assignments'],
      });

      queryClient.invalidateQueries({
        queryKey: ['assignment', assignmentId],
      });

      queryClient.setQueryData(['assignment-progress', assignmentId], {
        percent: 100,
        step: 'Completed',
      });
    };

    const onFailed = (payload: any) => {
      queryClient.invalidateQueries({
        queryKey: ['assignments'],
      });

      queryClient.invalidateQueries({
        queryKey: ['assignment', assignmentId],
      });

      queryClient.setQueryData(['assignment-progress', assignmentId], {
        error: payload.message,
      });
    };

    socket.on('assignment:progress', onProgress);

    socket.on('assignment:status', onStatus);

    socket.on('assignment:completed', onCompleted);

    socket.on('assignment:failed', onFailed);

    return () => {
      socket.emit('assignment:leave', assignmentId);

      socket.off('assignment:progress', onProgress);

      socket.off('assignment:status', onStatus);

      socket.off('assignment:completed', onCompleted);

      socket.off('assignment:failed', onFailed);
    };
  }, [socket, assignmentId, queryClient]);
}
