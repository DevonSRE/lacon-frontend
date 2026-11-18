"use client";

import { useQuery } from "@tanstack/react-query";

import SelectField from "@/components/SelectField";
import InputField from "@/components/form/input/InputField";
import { getOffenceOptions } from "../server/lifecycle";
import { needsOffenceDetail } from "@/lib/offences";

/**
 * The offence, chosen from LACON's list rather than typed (QA 2026-11-16,
 * row 47).
 *
 * Offence was a free-text box, so the same offence arrived spelled many ways
 * and the Offence filter on Cases and Reports listed typos and test text. The
 * filter is built from what was typed, so only this field could clean it.
 *
 * "Other" is always there, with a box for the words, so nobody is ever stopped
 * from filing by a list that does not cover their case.
 */
export default function OffenceField({
  offence,
  detail,
  errors,
  onChange,
}: {
  offence: string;
  detail: string;
  errors: Record<string, string | undefined>;
  onChange: (field: "offence" | "offence_detail", value: string) => void;
}) {
  const options = useQuery({
    queryKey: ["offence-options"],
    queryFn: async () => await getOffenceOptions(),
    // A fixed list: there is no reason to ask for it twice in a sitting.
    staleTime: Infinity,
  });
  const list = options.data?.success ? options.data.data : [];

  return (
    <div className="space-y-4">
      <SelectField
        name="offence"
        label="Offence"
        placeholder={options.isLoading ? "Loading offences…" : "Select the offence"}
        options={list.map(o => ({ value: o.code, label: o.label }))}
        required
        value={offence}
        onValueChange={value => onChange("offence", value)}
        error={!!errors.offence}
        errorMessage={errors.offence}
      />

      {/* The list could not load: the filer still has to be able to file. */}
      {options.data && !options.data.success && (
        <p className="text-xs text-amber-700">
          The offence list could not be loaded. Choose Other and type the offence.
        </p>
      )}

      {needsOffenceDetail(offence) && (
        <div>
          <InputField
            type="text"
            name="offence_detail"
            label="What is the offence?"
            required
            placeholder="e.g. Breach of a bail condition"
            value={detail}
            onChange={event => onChange("offence_detail", event.target.value)}
            className={errors.offence_detail ? "border-red-500 bg-red-50" : "border-gray-300"}
          />
          {errors.offence_detail && <p className="mt-1 text-xs text-red-500">{errors.offence_detail}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Recorded as you type it. Use the list where it covers the offence, so
            cases group together in reports.
          </p>
        </div>
      )}
    </div>
  );
}
