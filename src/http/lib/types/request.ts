import { IncomingMessage } from "http";

export interface Request extends IncomingMessage {
  body: any;
  params: { [key: string]: string };
  query: { [key: string]: string };
  route: {
    path: string;
    method: string;
  };
}

export interface RequestWithUser extends Request {
  userId: string;
}
