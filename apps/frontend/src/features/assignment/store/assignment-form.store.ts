import { create } from 'zustand';

interface AssignmentStore {
  assignmentId: string | null;
  totalAssignments: number;
  setAssignmentId: (id: string) => void;
  setTotal: (total: number) => void;
  clear: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignmentId: null,
  totalAssignments: 0,
  setTotal: (total) => set({ totalAssignments: total }),
  setAssignmentId: (id) =>
    set({
      assignmentId: id,
    }),

  clear: () =>
    set({
      assignmentId: null,
    }),
}));
