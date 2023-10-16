import Elysia from "elysia";
import { authController } from "./auth";
import { eventController } from "./event";

export const api = new Elysia({
  prefix: "/api",
})
  .use(authController)
  .use(eventController);
