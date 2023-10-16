import Elysia from "elysia";
import { authGroup } from "./(auth)/*";
import { dashboard } from "./dashboard";
import { eventDetails } from "./event-details";
import { eventImport } from "./event-import";
import { events } from "./events";
import { index } from "./index";

export const pages = new Elysia()
  .use(index)
  .use(authGroup)
  .use(eventImport)
  .use(dashboard)
  .use(events)
  .use(eventDetails);
