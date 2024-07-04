import { RegisterController } from "../../../http/controllers/register-controller";
import { makeRegister } from "../use-cases/make-register";

export function makeRegisterController(): RegisterController {
  return new RegisterController(makeRegister());
}
