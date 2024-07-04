import { InternalError } from "./internal-error";

export class RequestMethodNotDefinedException extends InternalError {
  statusCode = 400;

  constructor() {
    super("Request method is not defined");
  }
}
