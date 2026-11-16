"use client";

import { useMemo, useState, useTransition } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";

import { DataTable } from "@/components/data-table";
import TablePagination from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SelectField from "@/components/SelectField";
import TextAreaField from "@/components/TextAreaField";
import { CustomDialog } from "@/components/CustomDialog";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

import {
  decideProbonoReview,
  getProbonoReview,
  listProbonoReviews,
  type ProbonoReview,
} from "./probono-reviews";
import { createProbonoReviewColumns } from "./components/table-columns";

const STATUSES = [
  { value: "all", label: "All reviews" },
  { value: "PENDING", label: "Waiting" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
];

const day = (raw?: string | null) => {
  if (!raw) return "-";
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString("en-GB");
};

/**
 * The periodic case reviews pro bono lawyers send in, for the Custodial Centre
 * Decongestion Unit to read and accept.
 *
 * A submitted review used to go nowhere anyone could see: the cases were saved
 * against the lawyer and nothing told Decongestion or the Director General that
 * anything had arrived (QA 2026-11-01 run 4, 13 Nov, row 32).
 */
export default function ProbonoReviews() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 500);
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["probonoReviews", page, status, debounced],
    queryFn: async () =>
      await listProbonoReviews({
        page,
        size: DEFAULT_PAGE_SIZE,
        status,
        keyword: debounced || "all",
      }),
  });

  const rows = data?.success ? data.data.data : [];
  const columns = useMemo(() => createProbonoReviewColumns(setOpenId), []);

  return (
    <div className="min-w-0 max-w-full space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Pro Bono Case Reviews</h1>
          <p className="text-sm text-gray-600">
            The periodic reports designated pro bono lawyers send in, under clause 7 of their
            Letter of Designation.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={event => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, email or reference"
            className="h-11 w-72 pl-9"
          />
        </div>
        <div className="w-48">
          <SelectField
            name="status"
            label=""
            placeholder="All reviews"
            options={STATUSES}
            value={status}
            onValueChange={value => {
              setStatus(value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {data && !data.success && <p className="text-sm text-red-600">{data.message}</p>}

      <DataTable columns={columns} data={rows} loading={isLoading} />

      {!isLoading && rows.length === 0 && (
        <p className="text-sm text-gray-500">
          {status === "PENDING"
            ? "No case review is waiting to be read."
            : "No case review matches this view."}
        </p>
      )}

      {data?.success && (
        <TablePagination
          currentPage={page}
          totalCount={data.data.total_rows}
          pageSize={DEFAULT_PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      <CustomDialog open={!!openId} setOpen={() => setOpenId(null)} className="sm:max-w-4xl">
        {openId && (
          <ReviewDetails
            id={openId}
            onDecided={() => {
              queryClient.invalidateQueries({ queryKey: ["probonoReviews"] });
              setOpenId(null);
            }}
          />
        )}
      </CustomDialog>
    </div>
  );
}

function ReviewDetails({ id, onDecided }: { id: string; onDecided: () => void }) {
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [saving, startSaving] = useTransition();

  const { data, isLoading } = useQuery({
    queryKey: ["probonoReview", id],
    queryFn: async () => await getProbonoReview(id),
  });

  const decide = useMutation({
    mutationFn: async () =>
      await decideProbonoReview(id, decision as "accepted" | "rejected", reason),
  });

  if (isLoading) return <p className="p-6 text-sm text-gray-600">Loading the review…</p>;
  if (!data?.success) return <p className="p-6 text-sm text-red-600">{data?.message}</p>;

  const review: ProbonoReview = data.data;
  const waiting = (review.status ?? "").toUpperCase() === "PENDING";

  const submit = () =>
    startSaving(async () => {
      const result = await decide.mutateAsync();
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.data);
      onDecided();
    });

  return (
    <div className="space-y-6 p-2">
      <div>
        <h2 className="text-xl font-semibold">Case review {review.reference}</h2>
        <p className="text-sm text-gray-600">
          Sent by {review.lawyer_name || "this lawyer"} on {day(review.submitted_at)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-lg bg-gray-50 p-4 text-sm sm:grid-cols-2">
        <Row label="Lawyer" value={review.lawyer_name} />
        <Row label="Email" value={review.lawyer_email} />
        <Row label="Contact address" value={review.contact_address} />
        <Row label="Cases declared" value={String(review.case_count ?? review.cases?.length ?? 0)} />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          Cases on this review ({review.cases?.length ?? 0})
        </h3>
        <div className="min-w-0 max-w-full overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr>
                <th className="p-2 font-medium">Client</th>
                <th className="p-2 font-medium">Sex</th>
                <th className="p-2 font-medium">Offence / charge</th>
                <th className="p-2 font-medium">Nature of service</th>
                <th className="p-2 font-medium">Suit no.</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Date taken</th>
                <th className="p-2 font-medium">Last appearance</th>
                <th className="p-2 font-medium">In custody</th>
              </tr>
            </thead>
            <tbody>
              {(review.cases ?? []).map(item => (
                <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="p-2">{item.client_name || "-"}</td>
                  <td className="p-2">{item.sex || "-"}</td>
                  <td className="p-2">{item.offering_charge || "-"}</td>
                  <td className="p-2">{item.nature_of_service || "-"}</td>
                  <td className="p-2">{item.suit_number || "-"}</td>
                  <td className="p-2">{item.status_of_case || "-"}</td>
                  <td className="p-2">{day(item.date_case_taken)}</td>
                  <td className="p-2">{day(item.last_date_of_appearance)}</td>
                  <td className="p-2">{item.is_client_in_custody ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(review.cases?.length ?? 0) === 0 && (
          <p className="mt-2 text-xs text-gray-500">This review declared no cases.</p>
        )}
      </div>

      {waiting ? (
        <div className="space-y-4 rounded-lg border border-gray-200 p-4">
          <SelectField
            name="decision"
            label="Decision:"
            placeholder="Select decision"
            options={[
              { value: "accepted", label: "Accept" },
              { value: "rejected", label: "Reject" },
            ]}
            required
            value={decision}
            onValueChange={setDecision}
          />
          <TextAreaField
            name="reason"
            label="Reason (required when rejecting):"
            required={decision === "rejected"}
            placeholder="Why is this review being rejected?"
            value={reason}
            onChange={event => setReason(event.target.value)}
          />
          <Button
            type="button"
            disabled={!decision || saving}
            onClick={submit}
            className="h-11 w-full bg-black text-white"
          >
            {saving ? "Saving…" : "Submit decision"}
          </Button>
        </div>
      ) : (
        <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
          <Row label="Decision" value={review.status === "ACCEPTED" ? "Accepted" : "Rejected"} />
          <Row label="Reason" value={review.decision_reason} />
          <Row label="Decided by" value={review.decided_by?.name} />
          <Row label="Decided on" value={day(review.decided_at)} />
        </div>
      )}
    </div>
  );
}

const Row = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-600">{label}</span>
    <span className="text-right font-medium">{value?.trim() ? value : "-"}</span>
  </div>
);
