import { adaptMiddleware } from "../../main/adapter/adapt-middleware";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import { makeGetUserController } from "../../main/factories/controllers/make-get-user-controller";
import { makeRegisterController } from "../../main/factories/controllers/make-register-controller";
import { makeSignInController } from "../../main/factories/controllers/make-sign-in-controller";
import { makeAuthenticationCheckMiddleware } from "../../main/factories/middlewares/make-authentication-check-middleware";
import { Route } from "../lib/types/route";

const registerController = makeRegisterController();
const signInController = makeSignInController();
const authenticationCheckMiddleware = makeAuthenticationCheckMiddleware();
const getUserController = makeGetUserController();

export const authRoutes: Route[] = [
  {
    method: "POST",
    path: "/register",
    handler: adaptRouteHandler(registerController),
  },
  {
    method: "POST",
    path: "/signin",
    handler: adaptRouteHandler(signInController),
  },
  {
    method: "GET",
    path: "/me",
    middlewares: [adaptMiddleware(authenticationCheckMiddleware)],
    handler: adaptRouteHandler(getUserController),
  },
];
