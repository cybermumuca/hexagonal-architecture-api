import { InternalError } from "./internal-error";

export class RouteParamsNotFoundException extends InternalError {
  statusCode = 400;

  constructor() {
    super("Route params not found.");
  }
}
