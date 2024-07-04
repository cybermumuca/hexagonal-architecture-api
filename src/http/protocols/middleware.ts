export interface Middleware<T = any, U = any, V = any> {
  handle: (request: T, response: U, next: V) => Promise<void>;
}
