import type { Request, RequestWithUser } from "../../http/lib/types/request";
import type { Response } from "../../http/lib/types/response";
import { Controller } from "../../http/protocols/controller";

export const adaptRouteHandler = (controller: Controller) => {
  return async (req: Request | RequestWithUser, res: Response) => {
    await controller.handle(req, res);
  };
};
