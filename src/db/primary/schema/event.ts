import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { user } from ".";

export const events = sqliteTable("events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  duration: integer("duration").notNull(),
  user_id: text("user_id").notNull(),
});

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(user, {
    fields: [events.user_id],
    references: [user.id],
  }),
}));

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);
