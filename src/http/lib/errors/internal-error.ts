export abstract class InternalError extends Error {
  abstract statusCode: number;
  
  constructor(msg: string) {
    super(msg);
  }
}
