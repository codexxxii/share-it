import { Hono } from "hono";

import { createRouteHandler } from "uploadthing/server";

import { uploadRouter } from "./uploadthing";

const handlers = createRouteHandler({
  router: uploadRouter,
  config: {},
});

const app = new Hono();

const apiRoutes = app
  .basePath("/api")
  .all("/uploadthing", (context) => handlers(context.req.raw));

export type ApiRoutes = typeof apiRoutes;
export default app;
