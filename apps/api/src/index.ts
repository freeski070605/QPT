import { createServer } from "./server";

const { app, start } = createServer();

app.get("/", (_, res) => {
  res.json({ status: "ok", service: "resin-art-api" });
});

start();
