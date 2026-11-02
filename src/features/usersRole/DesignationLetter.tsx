"use client";
import React, { useEffect, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { downloadDesignationLetter } from "./letter-download";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProbunoLawyersRequestSingleAction } from "./userRoleAction";
import { displayStateName } from "@/lib/place-names";

const DesignationLetter = () => {
  const router = useRouter();
  const [downloading,startDownload]=useTransition();
  const download=()=>startDownload(async()=>{const r=await downloadDesignationLetter(String(id));if(!r.success){toast.error(r.message);return;}const url=URL.createObjectURL(new Blob([Uint8Array.from(atob(r.data),c=>c.charCodeAt(0))],{type:r.contentType}));const a=document.createElement("a");a.href=url;a.download=r.filename;a.click();URL.revokeObjectURL(url);});
  const params = useParams();
  const id = params.id;

  // Hooks must run on every render, so the query comes before any early return.
  const { data } = useQuery({
    queryKey: ["getProbunoLawyersRequestSingle", id],
    queryFn: async () => {
      return await getProbunoLawyersRequestSingleAction(String(id));
    },
    staleTime: 100000,
    enabled: !!id,
  });

  useEffect(() => {
    if (!id) router.back();
  }, [id, router]);

  if (!id) return null;

  const courts = data?.data?.criminal_courts_preference;
  const name = [data?.data?.first_name, data?.data?.last_name].filter(Boolean).join(" ");
  // The letter is dated the day the application was approved.
  const decided = data?.data?.decided_at ? new Date(data.data.decided_at) : null;
  const letterDate = decided && !Number.isNaN(decided.getTime())
    ? decided.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
  // Who approved the application signs the letter. The letter had no signature
  // block at all, so nothing said who it came from (QA 2026-11-01, item 7).
  const decidedBy = data?.data?.decided_by;
  const signatoryName = typeof decidedBy === "object" && decidedBy ? String(decidedBy.name ?? "") : "";
  const signatoryRole = typeof decidedBy === "object" && decidedBy && decidedBy.role
    ? String(decidedBy.role)
    : "For: Director General";

  return (
    <div className="max-w-4xl mx-auto bg-gray-100 p-8 print:bg-white">
      <div className="mb-4 flex justify-end gap-3 print:hidden">
        <button type="button" disabled={downloading} onClick={download} className="rounded bg-black px-4 py-2 text-sm text-white">{downloading ? "Preparing…" : "Download PDF"}</button>
        <button type="button" onClick={() => window.print()} className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
          Print
        </button>
      </div>
      <h1
        className="text-3xl text-center font-bold text-black mb-2"
        style={{ fontFamily: "Old English Text MT, serif" }}
      >
        Legal Aid Council
      </h1>
      <div className=" pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-sm">P.M.B. 398, Garki</div>
            <div className="text-sm text-red-600">Email:</div>
            <div className="text-sm">info@legalaidcouncil.gov.ng</div>
            <div className="text-sm text-red-600">Website:</div>
            <div className="text-sm">www.legalaidcouncil.gov.ng</div>
          </div>

          <div className="text-center flex-1">
            <div className="w-16 h-16 mx-auto  rounded-full flex items-center justify-center">
              <Image
                width={50}
                height={32}
                className="dark:hidden"
                src="/logo.png"
                alt="Logo"
              />
              {/* <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <span className="text-blue-500 font-bold text-xs">COAT</span>
                            </div> */}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-blue-500">Headquarters</div>
            <div className="text-sm">No. 20, Port-Harcourt</div>
            <div className="text-sm">Crescent Off Gimbiya Street,</div>
            <div className="text-sm">Area 11, Garki, Abuja.</div>
            {letterDate && <div className="text-sm">{letterDate}</div>}
          </div>
        </div>
      </div>

      {/* Lawyer Information Section */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <span className="text-red-600  px-4 py-1 text-sm font-bold">
            LAWYER INFORMATION
          </span>
        </div>

        <div className="grid grid-cols-2 bg-white p-4 gap-8">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Full Name:</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Firm:</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">State of Practice:</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Years of Practice:</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Preferred Courts:</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Max. Case Load:</span>
            </div>
          </div>

          <div className="space-y-2 text-right">
            <div className="text-sm">{name || "-"}</div>
            <div className="text-sm">{data?.data.law_firm_name || "-"}</div>
            <div className="text-sm">{displayStateName(data?.data.state_of_practice) || "-"}</div>
            <div className="text-sm">
              {data?.data.experience_in_criminal_law || "-"}
            </div>
            <div className="text-sm">
              {Array.isArray(courts) ? courts.join(", ") || "-" : courts || "-"}
            </div>
            <div className="text-sm">{data?.data.pro_bono_capacity || "-"}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold">
            DESIGNATION AS PRO BONO LEGAL AID SERVICES PROVIDER
          </h2>
        </div>

        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>Dear {name || "Counsel"},</strong>
          </p>

          <p>
            We write to bring to your attention, that your request to be
            registered as a Pro Bono Legal service provider under the Legal Aid
            Scheme of the Legal Aid Council has been granted. Consequently, you
            are by this letter, designated as a Pro-Bono Legal Services Provider
            Pursuant to PART IV of the Legal Aid Act, 2011.
          </p>

          <p>Your designation is as on the following terms:</p>

          <div className="ml-4 space-y-5">
            <p>
              <strong>1.</strong> Assignment of cases is subject to availability
              of cases from the Detention Centre&apos;s of the Nigerian correctional
              Services or any other place of detention earmarked by the Legal
              Aid Council.
            </p>

            <p>
              <strong>2.</strong> Cases are assigned within the State
              jurisdiction and location of Counsel&apos;s legal practice.
            </p>

            <p>
              <strong>3.</strong> Counsel is free to take on cases on Pro Bono
              within State jurisdiction of legal practice, and such cases shall
              be deemed assigned to Counsel. For Counsel to be entitled to the
              benefits accruing from the Council for prosecution of such cases,
              Counsel shall:
            </p>

            <div className="ml-8 space-y-2">
              <p>
                i. Register the case with the Legal Aid Council at the Custodial
                Centre Decongestion Unit;
              </p>
              <p>ii. Show evidence of registration;</p>
              <p>
                iii. Show proof of up to date financial standing with the
                Nigerian Bar Association (NBA) at the time of registering the
                case(s) with the Council.
              </p>
            </div>

            <p>
              <strong>4.</strong> Counsel shall undertake visitation to clients
              (where cases are assigned to them) who are in custody to interview
              them and take their brief in preparation for their defence, while
              the Counsel shall where the need arises, have the responsibility
              of notifying the authorities of the Custodial/Detention Centre,
              (as the case may be), to accord Counsel all necessary assistance
              needed during such visits.
            </p>

            <p>
              <strong>5.</strong> In cases assigned under this scheme, Counsel
              shall always announce appearance in Courts as appearing for the
              indigent client under the Pro Bono Scheme of the Legal Aid
              Council.
            </p>

            {/* The original of this paragraph was ungrammatical to the point of
                being unreadable (QA 2026-11-01, item 7). This is a plain-English
                restatement of its evident meaning; LACON should confirm the final
                wording before the letter is issued. */}
            <p>
              <strong>6.</strong> No funds are available under this scheme for
              witness expenses or for any other expense, however described, and
              no remuneration is or will be paid or reimbursed to Counsel for
              Pro Bono legal services rendered on behalf of the Council.
            </p>

            <p>
              <strong>7.</strong> Counsel shall render a half yearly report to
              the Council, on the progress of cases assigned or cases deemed
              assigned to them. This is to enable the Council monitor the
              progression of the cases and ensure due diligence.
            </p>

            <p>
              <strong>8.</strong> At the Conclusion of the trial in each case
              assigned or deemed assigned, Counsel shall forward a final report
              on the case, accompanied by a Certified True Copy (CTC) of the
              Judgment to the Legal Aid Council.
            </p>

            <p>
              <strong>9.</strong> Pursuant to Paragraph 8 above, an
              acknowledgment of successful completion of case(s) shall be issued
              to Counsel by the Legal Aid Council.
            </p>
          </div>

          <p>
            The Legal Aid Council looks forward to working with you in the
            provision of Pro Bono legal services on behalf of the Council.
          </p>

          {/* The letter used to end here, with no signatory at all. */}
          <div className="mt-10">
            <p>Yours faithfully,</p>
            <div className="mt-12 w-64 border-t border-black pt-2">
              <div className="text-sm font-semibold">{signatoryName || "\u00a0"}</div>
              <div className="text-sm">{signatoryRole}</div>
              <div className="text-sm">Legal Aid Council of Nigeria</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignationLetter;
