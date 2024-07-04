import { app } from "./app";

export const server = app.listen(3002, ({ port }) => {
  console.log(`Rodando na porta ${port}`);
});

process.on("uncaughtException", shutdown);
process.on("unhandledRejection", shutdown);

function shutdown(error: Error) {
  console.error(error);
  server.close();
  process.exit(1);
}
