import moment from "moment";
import { type Event } from "../db/primary/schema/event";

export default function EventDetailList({ events }: { events: Event[] }) {
  return (
    <div class="px-6 py-4">
      {!events || events.length === 0 ? (
        <p class="text-xl">
          You have no events instances for the selected event.
        </p>
      ) : (
        <ul class="space-y-6">
          {events.map((event) => (
            <li class="flex w-full items-center justify-between rounded border p-5 shadow-lg">
              <div class="flex w-full items-center space-x-6">
                <div class="">
                  <p class="w-full text-xl font-bold" safe>
                    {event.name}
                  </p>
                </div>
                <div class="grow text-right">
                  <p class="text-right text-lg text-gray-700" safe>
                    {moment(event.date)
                      .local(true)
                      .format("MMMM Do YYYY, HH:mm")}
                  </p>
                  <span class="text-right text-lg text-gray-700">
                    Duration:
                  </span>{" "}
                  <strong>{event.duration}h</strong>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
