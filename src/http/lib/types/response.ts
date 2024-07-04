import { ServerResponse } from "node:http";

export interface Response extends ServerResponse {
  status(code: number): Response;
  json(data: any): void;
}
