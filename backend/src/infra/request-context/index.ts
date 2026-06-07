import { AsyncLocalStorage } from 'async_hooks';

type RequestContextStore = {
  requestId: string;
};

export const requestContext = new AsyncLocalStorage<RequestContextStore>();

/**
 * Get current requestId from context
 */
export default function getRequestId(): string | undefined {
  return requestContext.getStore()?.requestId;
}
