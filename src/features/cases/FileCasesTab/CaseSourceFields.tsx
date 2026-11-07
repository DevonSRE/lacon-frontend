"use client";

import SelectField from "@/components/SelectField";
import InputField from "@/components/form/input/InputField";
import { CASE_SOURCES, needsBroughtBy, needsVisitDetails } from "@/lib/case-source";
import { todayISO } from "@/lib/form-options";

/**
 * Where this case came from, and who brought it (T17).
 *
 * The same fields on every internal filing form, because the question is the
 * same whatever the case type: a Decongestion lawyer collecting cases on a
 * custodial visit and a client walking into a state office both filed
 * "internally", and neither record said so.
 *
 * Only the fields the chosen source actually needs are shown: a walk-in client
 * brought themselves, and only a visit is placed at a facility on a date.
 */
export default function CaseSourceFields({
  values,
  errors,
  onChange,
}: {
  values: { case_source?: string; brought_by?: string; facility_name?: string; visit_date?: string };
  errors: Record<string, string | undefined>;
  onChange: (field: string, value: string) => void;
}) {
  const source = values.case_source ?? "";
  return (
    <div className="mb-6 space-y-4">
      <SelectField
        name="case_source"
        label="Where did this case come from?"
        placeholder="Select case source"
        options={CASE_SOURCES.map(s => ({ value: s.value, label: s.label }))}
        required
        value={source}
        onValueChange={value => onChange("case_source", value)}
        error={!!errors.case_source}
        errorMessage={errors.case_source}
      />

      {needsBroughtBy(source) && (
        <div>
          <InputField
            type="text"
            name="brought_by"
            label="Brought by"
            required
            placeholder="e.g. Barr. A. Musa, LACON lawyer"
            value={values.brought_by ?? ""}
            onChange={event => onChange("brought_by", event.target.value)}
            className={errors.brought_by ? "border-red-500 bg-red-50" : "border-gray-300"}
          />
          {errors.brought_by && <p className="mt-1 text-xs text-red-500">{errors.brought_by}</p>}
          <p className="mt-1 text-xs text-gray-500">
            The name and role or organisation of whoever handed the case over.
          </p>
        </div>
      )}

      {needsVisitDetails(source) && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <InputField
              type="text"
              name="facility_name"
              label="Facility visited"
              required
              placeholder="e.g. Kuje Custodial Centre"
              value={values.facility_name ?? ""}
              onChange={event => onChange("facility_name", event.target.value)}
              className={errors.facility_name ? "border-red-500 bg-red-50" : "border-gray-300"}
            />
            {errors.facility_name && <p className="mt-1 text-xs text-red-500">{errors.facility_name}</p>}
          </div>
          <div>
            <InputField
              type="date"
              name="visit_date"
              label="Date of visit"
              required
              max={todayISO()}
              value={values.visit_date ?? ""}
              onChange={event => onChange("visit_date", event.target.value)}
              className={errors.visit_date ? "border-red-500 bg-red-50" : "border-gray-300"}
            />
            {errors.visit_date && <p className="mt-1 text-xs text-red-500">{errors.visit_date}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
