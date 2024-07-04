import { InternalError } from "./internal-error";

export class RouteNotFoundException extends InternalError {
  statusCode = 404;

  constructor() {
    super("Route not Found");
  }
}
