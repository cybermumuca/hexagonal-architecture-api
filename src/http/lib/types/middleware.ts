import { NextFunction } from "./next-function";
import type { Request } from "./request";
import type { Response } from "./response";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
