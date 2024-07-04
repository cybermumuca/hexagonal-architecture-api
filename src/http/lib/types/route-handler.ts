import type { Request } from "./request";
import type { Response } from "./response";
export type RouteHandler = (req: Request, res: Response) => void;
