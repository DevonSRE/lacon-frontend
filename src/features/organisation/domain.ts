export type Centre = {
  id: string;
  title: string;
  state_id: string;
  state_name: string;
  zone_id?: string;
  zone_name?: string;
  center_coordinator_id?: string | null;
  cordinatore_name?: string | null;
  created_at?: string;
  updated_at?: string;
};
export type StateOption = { id: string; title: string };
export type CentrePage = { data: Centre[]; total_rows: number; total_pages: number; page: number; size: number };

/** The FCT is displayed in full everywhere, as the rest of the app does. */
export const displayState = (title: string) =>
  title.trim().toUpperCase() === "FCT" ? "Federal Capital Territory" : title;

/** A centre with no coordinator cannot hold cases yet, which is worth showing. */
export const coordinatorLabel = (centre: Centre) =>
  centre.cordinatore_name?.trim() || "No coordinator yet";
