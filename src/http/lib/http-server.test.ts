import { Server } from "http";
import request from "supertest";
import HttpServer from "./http-server";

describe("Http Server", () => {
  let app: HttpServer;
  let server: Server;

  beforeAll(() => {
    app = new HttpServer();

    app.use((req, res, next) => {
      if (req.route.path === "/" && req.route.method === "GET") {
        return res
          .status(200)
          .json({ message: "Hello from global middleware" });
      }

      next();
    });

    app.use((req, res, next) => {
      if (req.route.path === "/2" && req.route.method === "GET") {
        return res
          .status(200)
          .json({ message: "Hello from second global middleware" });
      }

      next();
    });

    app.register("/api", [
      {
        method: "GET",
        path: "/hello",
        middlewares: [],
        handler: (req, res) => {
          res.status(200).json({ message: "Hello, world!" });
        },
      },
      {
        method: "GET",
        path: "/middleware",
        middlewares: [
          (req, res, next) => {
            res.status(418).json({ message: "Hello from middleware" });
          },
        ],
        handler: (req, res) => {
          res.status(200).json({ message: "Hello, world!" });
        },
      },
      {
        method: "POST",
        path: "/body-test",
        middlewares: [
          (req, res, next) => {
            res.status(418).json({ message: "Hello from middleware" });
          },
        ],
        handler: (req, res) => {
          res.status(200).json({ message: "Hello, world!" });
        },
      },
    ]);

    app.register("/test", [
      {
        method: "GET",
        path: "/:id",
        middlewares: [],
        handler: (req, res) => {
          res.status(200).json({ message: `id: ${req.params.id}` });
        },
      },
    ]);

    server = app.listen(3000);
  });

  afterAll(() => {
    server.close();
  });

  it("should handle a global middleware", async () => {
    const response = await request("http://localhost:3000").get("");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello from global middleware" });
  });

  it("should handle a chain of global middlewares", async () => {
    const response = await request("http://localhost:3000").get("/2");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Hello from second global middleware",
    });
  });

  it("should respond with a JSON message from route middleware", async () => {
    const response = await request("http://localhost:3000").get(
      "/api/middleware"
    );

    expect(response.status).toBe(418);
    expect(response.body).toEqual({ message: "Hello from middleware" });
  });

  it("should respond with a JSON message from route handler", async () => {
    const response = await request("http://localhost:3000").get("/api/hello");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello, world!" });
  });

  it("should found route with dynamic path", async () => {
    const response = await request("http://localhost:3000").get("/test/5");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "id: 5" });
  });

  it("should return HTTP status code 404 for non-existent route", async () => {
    const response = await request("http://localhost:3000").get(
      "/api/non-existent"
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Route not Found" });
  });

  it("should return HTTP status code 400 if request body is unformatted", async () => {
    const response = await request("http://localhost:3000")
      .post("/api/body-test")
      .send("{");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid Body" });
  });
});
