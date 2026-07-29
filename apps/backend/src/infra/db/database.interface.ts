/**
 * Abstract Database Interface
 * -------------------------------------------------------
 * Enforces a consistent database contract across all transports.
 * All custom Databases MUST extend this class.
 */
export abstract class DatabaseInterface<TConnection = unknown> {
  abstract connect(): Promise<TConnection>;

  abstract disconnect(): Promise<void>;

  abstract getConnection(): TConnection;

  abstract isConnected(): boolean;
}
