import { GetUserController } from "../../../http/controllers/get-user-controller";
import { makeGetUser } from "../use-cases/make-get-user";

export function makeGetUserController(): GetUserController {
  return new GetUserController(makeGetUser());
}
