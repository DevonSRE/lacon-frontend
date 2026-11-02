"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { GetEventsAction } from "@/features/cases/server/caseAction";

type Event = { casefile_id: string; event_date: string; event_type: string; case_title: string };

export default function LawyerUpcomingEvents() {
  const { data: user } = useAppSelector(state => state.profile);
  const events = useQuery({
    queryKey: ["case-lifecycle", user?.id, "events"],
    queryFn: async () => {
      const result = await GetEventsAction({ page: 1, size: 20 }, user!.id);
      if (!result.success) throw new Error("Events could not be loaded.");
      return (result.data ?? []) as Event[];
    },
    enabled: !!user?.id,
  });
  return <section className="mt-8 space-y-3"><h2 className="text-lg font-semibold">Upcoming events</h2>
    {events.isLoading ? <p>Loading events…</p> : events.isError ? <p>Events could not be loaded.</p> : !events.data?.length ? <p className="text-sm text-gray-500">No upcoming events found.</p> : <ul className="grid gap-3 sm:grid-cols-2">{events.data.map((event, index) => <li key={`${event.casefile_id}-${index}`} className="rounded border p-3 text-sm">{new Date(event.event_date).toLocaleDateString("en-GB")} · {event.event_type} · <a className="underline" href={`/cases/${event.casefile_id}`}>{event.case_title}</a></li>)}</ul>}
  </section>;
}
