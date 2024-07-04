import { SignInController } from "../../../http/controllers/sign-in-controller";
import { makeSignIn } from "../use-cases/make-sign-in";

export function makeSignInController(): SignInController {
  return new SignInController(makeSignIn());
}
