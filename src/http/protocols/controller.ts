export interface Controller<T = any, U = any> {
  handle: (request: T, response: U) => Promise<void>;
}
