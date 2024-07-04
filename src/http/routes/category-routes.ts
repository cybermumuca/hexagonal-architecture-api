import { adaptMiddleware } from "../../main/adapter/adapt-middleware";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import { makeCreateCategoryController } from "../../main/factories/controllers/make-create-category-controller";
import { makeGetCategoriesController } from "../../main/factories/controllers/make-get-categories-controller";
import { makeGetCategoryController } from "../../main/factories/controllers/make-get-category-controller";
import { makeGetCategoryPostsController } from "../../main/factories/controllers/make-get-category-posts-controller";
import { makeAuthenticationCheckMiddleware } from "../../main/factories/middlewares/make-authentication-check-middleware";
import { Route } from "../lib/types/route";

const getCategoryController = makeGetCategoryController();
const createCategoryController = makeCreateCategoryController();
const authenticationCheckMiddleware = makeAuthenticationCheckMiddleware();
const getCategoriesController = makeGetCategoriesController();
const getCategoryPostsController = makeGetCategoryPostsController();

export const categoryRoutes: Route[] = [
  {
    method: "GET",
    path: "/",
    handler: adaptRouteHandler(getCategoriesController),
  },
  {
    method: "GET",
    path: "/:id",
    handler: adaptRouteHandler(getCategoryController),
  },
  {
    method: "GET",
    path: "/:id/posts",
    handler: adaptRouteHandler(getCategoryPostsController),
  },
  {
    method: "POST",
    path: "/",
    middlewares: [adaptMiddleware(authenticationCheckMiddleware)],
    handler: adaptRouteHandler(createCategoryController),
  },
];
