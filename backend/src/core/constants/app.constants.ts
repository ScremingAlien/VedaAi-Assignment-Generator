export const APP_SETTING = {
  Max_Listners: 20,
  REQUEST_ID_HEADER: 'x-request-id',
} as const;

export type AppSettings = typeof APP_SETTING;
