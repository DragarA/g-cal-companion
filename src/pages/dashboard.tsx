import { Elysia } from "elysia";
import moment from "moment";
import { FancyLink } from "../components";
import { BaseHtml } from "../components/base";
import { Dashboard } from "../components/dashboard";
import { ctx } from "../context";
import { redirect } from "../lib";

export const dashboard = new Elysia()
  .use(ctx)
  .get("/dashboard", async ({ session, set, headers, html }) => {
    if (!session) {
      redirect({ set, headers }, "/login");
      return;
    }

    const today = moment();

    const startOfCurrentMonth = today.startOf("month").format("YYYY-MM-DD");
    const endOfCurrentMonth = today.endOf("month").format("YYYY-MM-DD");

    const startOfPreviousMonth = moment()
      .subtract(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfPreviousMonth = moment()
      .subtract(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");

    const currentYear = today.year();

    const lastMonthLink = `/events?dateFrom=${startOfPreviousMonth}&dateTo=${endOfPreviousMonth}&search=jahanje`;
    const thisMonthLink = `/events?dateFrom=${startOfCurrentMonth}&dateTo=${endOfCurrentMonth}&search=jahanje`;
    const thisYearLink = `/events?dateFrom=${currentYear}-01-01&dateTo=${currentYear}-12-31&search=jahanje`;

    return html(() => (
      <BaseHtml>
        <Dashboard>
          <main class="flex-1 space-y-4 py-5">
            <div class="relative flex items-center justify-between px-6 py-3">
              <div>
                <h6 class="text-4xl" safe>
                  Welcome, {session.user.name}
                </h6>
                <p class="text-xl">Quick links</p>
              </div>
              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>

            <div class="grid grid-cols-1 gap-5 px-5 md:grid-cols-2 lg:grid-cols-3">
              <Card name="Last month" href={lastMonthLink} />
              <Card name="This month" href={thisMonthLink} />
              <Card name="This year" href={thisYearLink} />
            </div>
          </main>
        </Dashboard>
      </BaseHtml>
    ));
  });

function Card({ name, href }: { name: string; href: string }) {
  return (
    <div class="relative rounded-md border p-5 ">
      <h3 class="text-xl">{name}</h3>
      <FancyLink text="View" href={href} />
    </div>
  );
}
