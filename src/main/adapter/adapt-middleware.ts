import { NextFunction } from "../../http/lib/types/next-function";
import type { Request, RequestWithUser } from "../../http/lib/types/request";
import type { Response } from "../../http/lib/types/response";
import { Middleware } from "../../http/protocols/middleware";

export const adaptMiddleware = (middleware: Middleware) => {
  return async (
    req: Request | RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    await middleware.handle(req, res, next);
  };
};
