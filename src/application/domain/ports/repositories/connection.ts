export abstract class Connection {
  abstract query<T>(query: string, params: any[]): Promise<T>;
  abstract get<T>(query: string, params: any[]): Promise<T | null>;
  abstract execute(query: string, params: any[]): Promise<void>;
  abstract close(): Promise<void>;
}
