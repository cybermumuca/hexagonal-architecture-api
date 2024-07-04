import { adaptMiddleware } from "../../main/adapter/adapt-middleware";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import { makeCreatePostController } from "../../main/factories/controllers/make-create-post-controller";
import { makeGetPostController } from "../../main/factories/controllers/make-get-post-controller";
import { makeGetPostsController } from "../../main/factories/controllers/make-get-posts-controller";
import { makeAuthenticationCheckMiddleware } from "../../main/factories/middlewares/make-authentication-check-middleware";
import { Route } from "../lib/types/route";

const authenticationCheckMiddleware = makeAuthenticationCheckMiddleware();
const createPostController = makeCreatePostController();
const getPostController = makeGetPostController();
const getPostsController = makeGetPostsController();

export const postRoutes: Route[] = [
  {
    method: "POST",
    path: "/",
    middlewares: [adaptMiddleware(authenticationCheckMiddleware)],
    handler: adaptRouteHandler(createPostController),
  },
  {
    method: "GET",
    path: "/",
    handler: adaptRouteHandler(getPostsController),
  },
  {
    method: "GET",
    path: "/:id",
    handler: adaptRouteHandler(getPostController),
  },
];
