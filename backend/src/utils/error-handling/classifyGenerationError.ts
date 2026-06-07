export enum GenerationFailureType {
  AI_VALIDATION_ERROR = 'AI_VALIDATION_ERROR',

  RATE_LIMIT = 'RATE_LIMIT',

  AI_TIMEOUT = 'AI_TIMEOUT',

  NETWORK_ERROR = 'NETWORK_ERROR',

  PROVIDER_UNAVAILABLE = 'PROVIDER_UNAVAILABLE',

  INVALID_PROMPT = 'INVALID_PROMPT',

  ASSIGNMENT_NOT_FOUND = 'ASSIGNMENT_NOT_FOUND',

  UNKNOWN = 'UNKNOWN',
}

export function classifyGenerationError(error: unknown) {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Structured output / tool failures
  if (message.includes('tool_use_failed') || message.includes('failed to call a function')) {
    return {
      type: GenerationFailureType.AI_VALIDATION_ERROR,
      retryable: true,
    };
  }

  // Rate limit
  if (message.includes('429') || message.includes('rate limit') || message.includes('ratelimit')) {
    return {
      type: GenerationFailureType.RATE_LIMIT,
      retryable: true,
    };
  }

  // Timeout
  if (message.includes('timeout') || message.includes('etimedout')) {
    return {
      type: GenerationFailureType.AI_TIMEOUT,
      retryable: true,
    };
  }

  // Network
  if (
    message.includes('econnreset') ||
    message.includes('fetch failed') ||
    message.includes('socket hang up')
  ) {
    return {
      type: GenerationFailureType.NETWORK_ERROR,
      retryable: true,
    };
  }

  // Provider outage
  if (
    message.includes('500') ||
    message.includes('502') ||
    message.includes('503') ||
    message.includes('504')
  ) {
    return {
      type: GenerationFailureType.PROVIDER_UNAVAILABLE,
      retryable: true,
    };
  }

  // Business errors
  if (message.includes('assignment not found')) {
    return {
      type: GenerationFailureType.ASSIGNMENT_NOT_FOUND,
      retryable: false,
    };
  }

  return {
    type: GenerationFailureType.UNKNOWN,
    retryable: false,
  };
}

// infra/ai/errors/assessment-generation.error.ts

export class AssessmentGenerationError extends Error {
  constructor(
    public readonly type: string,
    public readonly retryable: boolean,
    public readonly originalError: unknown,
  ) {
    super(originalError instanceof Error ? originalError.message : 'Assessment generation failed');

    this.name = 'AssessmentGenerationError';
  }
}
