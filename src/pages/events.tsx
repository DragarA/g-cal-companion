import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { Dashboard } from "../components/dashboard";
import { ctx } from "../context";
import { redirect } from "../lib";

export const events = new Elysia()
  .use(ctx)
  .get("/events", async ({ session, set, headers, html, query }) => {
    if (!session) {
      redirect({ set, headers }, "/login");
      return;
    }

    return html(() => (
      <BaseHtml>
        <Dashboard>
          <main class="h-full flex-1 space-y-4 overflow-scroll py-5">
            <div class="relative flex items-center justify-between px-6 py-3">
              <div>
                <h2 class="text-4xl" safe>
                  Events preview
                </h2>
              </div>
              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>
            <form
              class="space-y-3 p-8"
              hx-post="/api/event"
              hx-target-4xx="#errorMessage"
              hx-target-5xx="#errorMessage"
              hx-swap="innerHTML"
              hx-target="#eventList"
              hx-trigger="load"
            >
              <div class="grid grid-cols-1 gap-5 px-5 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label
                    for="dateFrom"
                    class="block text-sm font-medium text-gray-600"
                  >
                    Start date
                  </label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={query?.dateFrom ?? ""}
                    placeholder="Select your start date"
                    required="true"
                    class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label
                    for="dateTo"
                    class="block text-sm font-medium text-gray-600"
                  >
                    End date
                  </label>
                  <input
                    type="date"
                    name="dateTo"
                    value={query?.dateTo ?? ""}
                    placeholder="Select your end date"
                    required="true"
                    class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label
                    for="dateTo"
                    class="block text-sm font-medium text-gray-600"
                  >
                    Search
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={query?.search ?? ""}
                    placeholder="Enter a search string"
                    class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div class="lg:pt-5">
                  <button
                    type="submit"
                    data-loading-disable
                    class="flex w-full items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    Show events
                    <div
                      data-loading
                      class="i-lucide-loader-2 ml-2 animate-spin text-2xl"
                    />
                  </button>
                  <div class=" text-red-400" id="errorMessage" />
                </div>
              </div>
            </form>
            <div id="eventList"></div>
          </main>
        </Dashboard>
      </BaseHtml>
    ));
  });
