import { InternalError } from "./internal-error";

export class RequestBodyUnformattedException extends InternalError {
  statusCode = 400;

  constructor() {
    super("Invalid Body");
  }
}
