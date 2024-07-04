import { Middleware } from "./middleware";
import { RouteHandler } from "./route-handler";

export interface Route {
  method: string;
  path: string;
  middlewares?: Middleware[];
  handler: RouteHandler;
}
