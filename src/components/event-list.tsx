export default function EventList({
  events,
  dateFrom,
  dateTo,
  search,
}: {
  events: { name: string; totalDuration: number }[];
  dateFrom: string;
  dateTo: string;
  search: string;
}) {
  return (
    <div class="px-6 py-4">
      {!events || events.length === 0 ? (
        <p class="text-xl">
          You have no events for the selected dates. Import events using the{" "}
          <a class="text-blue" href="/event-import">
            {" "}
            Import page
          </a>
        </p>
      ) : (
        <ul class="space-y-6">
          {events.map((event) => (
            <li class="flex items-center justify-between rounded border p-5 shadow-lg">
              <div class="flex items-center space-x-6">
                <div>
                  <a
                    href={`/event-details?name=${encodeURIComponent(
                      event.name,
                    )}&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${search}`}
                  >
                    <p class="text-xl font-bold" safe>
                      {event.name}
                    </p>
                  </a>
                  <p class="text-lg text-gray-700" safe>
                    {event.totalDuration}
                  </p>
                </div>
              </div>
            </li>
          ))}
          <li class="flex items-center justify-between rounded border p-5 shadow-lg">
            <div class="flex items-center space-x-6">
              <div>
                <p class="text-xl font-bold" safe>
                  Total
                </p>
                <p class="text-lg text-gray-700" safe>
                  {events.reduce(
                    (accumulator, event) => accumulator + event.totalDuration,
                    0,
                  )}
                </p>
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
