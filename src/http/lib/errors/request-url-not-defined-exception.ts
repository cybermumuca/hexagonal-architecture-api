import { InternalError } from "./internal-error";

export class RequestUrlNotDefinedException extends InternalError {
  statusCode = 400;

  constructor() {
    super("Request url is not defined");
  }
}
