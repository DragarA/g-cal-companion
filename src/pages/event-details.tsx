import { and, eq, gte, lte } from "drizzle-orm";
import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { Dashboard } from "../components/dashboard";
import EventDetailList from "../components/event-detail-list";
import { ctx } from "../context";
import { events } from "../db/primary/schema";
import { redirect } from "../lib";

export const eventDetails = new Elysia()
  .use(ctx)
  .get("/event-details", async ({ db, session, set, headers, html, query }) => {
    if (!session) {
      redirect({ set, headers }, "/login");
      return;
    }
    console.log(query);

    const dateFrom = new Date(query.dateFrom!);
    const dateTo = new Date(query.dateTo!);

    const eventList = await db.query.events.findMany({
      where: and(
        eq(events.user_id, session.user.id),
        gte(events.date, dateFrom),
        lte(events.date, dateTo),
        eq(events.name, query.name!),
      ),
    });

    console.log(eventList);

    return html(() => (
      <BaseHtml>
        <Dashboard>
          <main class="h-full flex-1 space-y-4 overflow-scroll py-5">
            <div class="relative flex items-center justify-between px-6 py-3">
              <div>
                <h2 class="text-4xl" safe>
                  Event details
                </h2>
                <a
                  href={`/events?dateFrom=${query.dateFrom}&dateTo=${query.dateTo}&search=${query.search}`}
                >
                  Back to events
                </a>
              </div>
              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>
            <EventDetailList events={eventList}></EventDetailList>
          </main>
        </Dashboard>
      </BaseHtml>
    ));
  });
