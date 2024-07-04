import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { InternalError } from "./errors/internal-error";
import { RequestBodyUnformattedException } from "./errors/request-body-unformatted-exception";
import { RequestMethodNotDefinedException } from "./errors/request-method-not-defined-exception";
import { RequestUrlNotDefinedException } from "./errors/request-url-not-defined-exception";
import { RouteNotFoundException } from "./errors/route-not-found-exception";
import type { Middleware } from "./types/middleware";
import type { Request } from "./types/request";
import type { Response } from "./types/response";
import type { Route } from "./types/route";
import type { RouteHandler } from "./types/route-handler";

export default class HttpServer {
  private routes: Route[] = [];
  private middlewares: Middleware[] = [];

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  private addRoute(
    method: string,
    path: string,
    middlewares: Middleware[],
    handler: RouteHandler
  ) {
    this.routes.push({ method, path, middlewares, handler });
  }

  register(pathPrefix: string, routes: Route[]) {
    routes.forEach((route) => {
      const path = route.path === "/" ? "" : route.path;

      this.addRoute(
        route.method,
        pathPrefix + path,
        route.middlewares ?? [],
        route.handler
      );
    });
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const request = req as Request;
    const response = res as Response;

    this.enhanceResponse(response);

    try {
      await this.enhanceRequest(request);
      await this.executeMiddlewares(this.middlewares, request, response);

      if (response.writableEnded) return;

      const route = this.foundRoute(request);

      return this.processRoute(route, request, response);
    } catch (error) {
      return this.errorHandler(error, request, response);
    }
  }

  private buildRoutePath(path: string) {
    const routeParametersRegex = /:([a-zA-Z]+)/g;
    const pathWithParams = path.replaceAll(
      routeParametersRegex,
      "(?<$1>[a-z0-9-_]+)"
    );

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

    return pathRegex;
  }

  private enhanceResponse(res: ServerResponse) {
    const response = res as Response;

    Reflect.set(response, "status", function status(code: number) {
      this.statusCode = code;
      return this;
    });

    Reflect.set(response, "json", function json(data: any) {
      if (!this.statusCode) {
        this.statusCode = 200;
      }

      this.setHeader("Content-Type", "application/json");
      this.setHeader("Connection", "close");
      this.end(JSON.stringify(data));
    });
  }

  private foundRoute(request: Request) {
    if (!request.url) throw new RequestUrlNotDefinedException();

    if (!request.method) throw new RequestMethodNotDefinedException();

    const route = this.routes.find((route) => {
      return (
        route.method === request.method &&
        this.buildRoutePath(route.path).test(request.url!)
      );
    });

    if (!route) {
      throw new RouteNotFoundException();
    }

    const routeParams = request.url.match(this.buildRoutePath(route.path));

    if (!routeParams?.groups) throw new Error("Route params not found");

    const { query, ...params } = routeParams.groups;

    Reflect.set(request, "query", query ? this.extractQueryParams(query) : {});
    Reflect.set(request, "params", params);

    return route;
  }

  private async buildBody(request: Request) {
    const buffers: Uint8Array[] = [];

    for await (const chunk of request) {
      buffers.push(chunk);
    }

    let body: any = {};

    if (buffers.length > 0) {
      const decoder = new TextDecoder("utf-8");
      const decodedBody = decoder.decode(Buffer.concat(buffers));

      try {
        body = JSON.parse(decodedBody);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new RequestBodyUnformattedException();
        }
        throw new Error(`Error parsing request body: ${error.message}`);
      }
    }

    Reflect.defineProperty(request, "body", {
      value: body,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  private extractQueryParams(query) {
    return query
      .substr(1)
      .split("&")
      .reduce((queryParams, param) => {
        const [key, value] = param.split("=");

        queryParams[key] = value;

        return queryParams;
      }, {});
  }

  private async enhanceRequest(request: Request) {
    Reflect.set(request, "route", {
      path: request.url,
      method: request.method,
    });

    await this.buildBody(request);
  }

  private errorHandler(error: Error, request: Request, response: Response) {
    if (error instanceof InternalError) {
      return response.status(error.statusCode).json({ message: error.message });
    }

    return response.status(500).json({ message: "Internal Server Error" });
  }

  private async executeMiddlewares(
    middlewares: Middleware[],
    req: Request,
    res: Response
  ) {
    let index = 0;

    const nextMiddleware = async (err?: Error) => {
      if (err || index >= middlewares.length) {
        if (err) throw err;
        return;
      }

      const middleware = middlewares[index];
      index += 1;

      try {
        await Promise.resolve(middleware(req, res, nextMiddleware));
      } catch (error) {
        throw error;
      }
    };

    await nextMiddleware();
  }

  private async processRoute(
    route: Route,
    request: Request,
    response: Response
  ) {
    const middlewares = route.middlewares || [];

    if (middlewares.length === 0) {
      return await Promise.resolve(route.handler(request, response));
    }

    await this.executeMiddlewares(middlewares, request, response);

    if (response.writableEnded) return;

    return await Promise.resolve(route.handler(request, response));
  }

  listen(
    port: number,
    callback?: ({ host, port }: { host: string; port: number }) => void
  ) {
    const server = http.createServer(
      async (req, res) => await this.handleRequest(req, res)
    );

    server.listen(port, () => {
      const address = server.address();
      const host = typeof address === "string" ? address : address?.address;
      if (callback && host) {
        callback({ host, port });
      }
    });

    return server;
  }
}
