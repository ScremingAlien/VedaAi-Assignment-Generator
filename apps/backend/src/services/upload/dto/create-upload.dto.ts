import { z } from 'zod';

export const CreateUploadDTO = z.object({
  title: z.string().min(1),
  completed: z.boolean().optional().default(false),
});

export type CreateUploadDTOType = z.infer<typeof CreateUploadDTO>;
