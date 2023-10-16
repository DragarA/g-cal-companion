import { and, eq, gte, like, lte } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { google } from "googleapis";
import EventList from "../components/event-list";
import { ctx } from "../context";
import { events, user } from "../db/primary/schema";
import { type User } from "../db/primary/schema/auth";
import { redirect } from "../lib";

export const eventController = new Elysia({
  prefix: "/event",
})
  .use(ctx)
  .post(
    "/import",
    async ({ db, body, set, headers, session }) => {
      if (!session) {
        redirect({ set, headers }, "/login");
        return;
      }

      const dateFrom = new Date(body.dateFrom);
      const dateTo = new Date(body.dateTo);

      const dbUser: User | undefined = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
      });

      if (!dbUser) {
        redirect({ set, headers }, "/login");
        return;
      }

      const clientId = process.env.GOOGLE_CLIENT_ID!;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

      const auth = new google.auth.OAuth2({
        clientId,
        clientSecret,
      });
      auth.setCredentials({
        access_token: dbUser.access_token,
      });

      console.log(auth);

      const calendar = google.calendar({
        version: "v3",
        auth,
      });

      const eventListResponse = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date(2023, 9, 1).toISOString(),
        timeMax: new Date(2023, 10, 1).toISOString(),
        singleEvents: true,
      });

      const eventList = eventListResponse?.data?.items;

      console.log(eventList);
      if (!eventList?.length) {
        set.status = "Not Found";
        return "No events found.";
      }

      await db
        .delete(events)
        .where(
          and(
            eq(events.user_id, session.user.id),
            gte(events.date, dateFrom),
            lte(events.date, dateTo),
          ),
        );

      const dbEventList = eventList
        .filter(
          (event) => event.start?.dateTime != null && event.summary?.length,
        )
        .map((event) => ({
          name: event.summary!,
          date: new Date(event.start!.dateTime!),
          user_id: session.user.id,
        }));

      await db.insert(events).values(dbEventList);

      redirect(
        { set, headers },
        `/events?dateFrom=${body.dateFrom}&dateTo=${body.dateTo}`,
      );
    },
    {
      body: t.Object({
        dateFrom: t.String(),
        dateTo: t.String(),
      }),
    },
  )
  .post(
    "/",
    async ({ db, body, set, headers, session }) => {
      if (!session) {
        redirect({ set, headers }, "/login");
        return;
      }

      const dateFrom = new Date(body.dateFrom);
      const dateTo = new Date(body.dateTo);
      const search = body.search;
      console.log(search);

      const eventList = await db.query.events.findMany({
        where: and(
          eq(events.user_id, session.user.id),
          gte(events.date, dateFrom),
          lte(events.date, dateTo),
          like(events.name, `%${search}%`),
        ),
      });

      const eventsWithCounts: Record<string, number> = {};

      eventList.map((event) => {
        if (!eventsWithCounts[event.name]) {
          eventsWithCounts[event.name] = 1;
        } else {
          eventsWithCounts[event.name]++;
        }
      });

      const mappedEvents = Object.entries(eventsWithCounts)?.map(
        (eventRecord) => ({
          name: eventRecord[0],
          numberOfOccurences: eventRecord[1],
        }),
      );

      return (
        <EventList
          events={mappedEvents}
          dateFrom={body.dateFrom}
          dateTo={body.dateTo}
          search={body.search}
        ></EventList>
      );
    },
    {
      body: t.Object({
        dateFrom: t.String(),
        dateTo: t.String(),
        search: t.String(),
      }),
    },
  );
