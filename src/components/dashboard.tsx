import { type PropsWithChildren } from "beth-stack/jsx";

export function Dashboard({ children }: PropsWithChildren) {
  return (
    <div class="flex h-screen w-full flex-col md:flex-row">
      <nav class="flex h-full min-w-[18rem] flex-col bg-gray-800 p-5 text-white lg:w-64">
        <ul class="flex-grow space-y-6">
          <DashBoardItem text="Home" logo="i-lucide-home" href="/dashboard" />
          <DashBoardItem
            text="Import"
            logo="i-lucide-import"
            href="/event-import"
          />
          <DashBoardItem
            text="Events"
            logo="i-lucide-calendar-days"
            href="/events"
          />
          <DashBoardItem
            text="Sign Out"
            logo="i-lucide-log-out"
            href="/api/auth/signout"
          />
        </ul>
      </nav>
      <div class="h-screen w-full">{children}</div>
    </div>
  );
}

function DashBoardItem({
  text,
  logo,
  href,
  newTab,
}: {
  text: string;
  logo: string;
  href: string;
  newTab?: boolean;
}) {
  return (
    <li>
      <a
        class="flex items-center gap-3 py-2 text-2xl font-light hover:underline"
        href={href}
        target={newTab ? "_blank" : ""}
      >
        <div class={logo} />
        <span>{text}</span>
      </a>
    </li>
  );
}
