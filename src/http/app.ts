import "dotenv/config";
import { SQLiteConnection } from "../application/domain/adapters/repositories/sqlite-connection";
import HttpServer from "./lib/http-server";

new SQLiteConnection(process.env.DATABASE);

export const app = new HttpServer();

(async () => {
  const { authRoutes } = await import("./routes/auth-routes");
  const { categoryRoutes } = await import("./routes/category-routes");
  const { postRoutes } = await import("./routes/post-routes");

  app.register("/auth", authRoutes);
  app.register("/categories", categoryRoutes);
  app.register("/posts", postRoutes);
})();
