import test from "node:test";
import assert from "node:assert/strict";
import { apiMessage } from "../src/lib/api-message.ts";
import { rejectReasonProblem } from "../src/lib/decision-reason.ts";
import { isRequesterOffice, requestableRolesFor } from "../src/lib/requestable-roles.ts";
import { serverToast } from "../src/lib/server-toast.ts";
import { canPrintAcknowledgement } from "../src/lib/acknowledgement.ts";
import { emptyPoolMessage, pickerEmptyMessage } from "../src/lib/recipient-picker.ts";
import { casesDirectRoles, casesSubMenuRoles } from "../src/lib/navigation.ts";
import { byLabel, caseCount, matchesOption, narrowOptions } from "../src/lib/filter-options.ts";
import { MAX_CASE_LOAD, caseLoadLabel, caseLoadProblem } from "../src/lib/case-load.ts";

// QA 2026-11-16, row 19: "Rejecting a request shows only 'successfully'
// instead of 'Request rejected.'" The API had been saying it all along; the
// screen replaced it with a word of its own.
test("row 19: the API's own words reach the person who acted", () => {
  assert.equal(apiMessage("Request rejected", "Done"), "Request rejected");
  assert.equal(apiMessage("Request approved", "Done"), "Request approved");

  // Only a genuinely empty answer falls back, and never to "successfully".
  for (const empty of [undefined, null, "", "   ", 0, {}, []]) {
    assert.equal(apiMessage(empty, "Done"), "Done");
  }

  assert.equal(apiMessage("  Request rejected  ", "Done"), "Request rejected");
});

// QA 2026-11-16, row 55: "Reject with an empty note is blocked, but nothing
// tells the DG a reason is needed." The dialog disabled its own button and
// said nothing, so the click read as a fault.
test("row 55: an empty rejection note says what is needed", () => {
  assert.equal(
    rejectReasonProblem(""),
    "Enter a reason to reject this request."
  );
  assert.equal(
    rejectReasonProblem("   \n  "),
    "Enter a reason to reject this request."
  );
  // A reason given means nothing is in the way.
  assert.equal(rejectReasonProblem("Duplicate of an earlier request"), undefined);
});

// QA 2026-11-16, row 31: "Message is still the old long text, not the wording
// in Expected. The Role list still offers Pro bono and NYSC Lawyer."
test("row 31: an office is only offered the roles it may ask for", () => {
  // The five unit heads and the three place offices raise requests.
  for (const office of [
    "DECONGESTION UNIT HEAD", "PREROGATIVE OF MERCY UNIT HEAD", "OSCAR UNIT HEAD",
    "PDSS UNIT HEAD", "DIO UNIT HEAD", "ZONAL DIRECTOR", "STATE COORDINATOR",
    "CENTRE COORDINATOR",
  ]) {
    assert.equal(isRequesterOffice(office), true, office);
    const offered = requestableRolesFor(office);
    assert.deepEqual(offered, ["LACON LAWYER", "INTERNAL PARALEGAL", "EXTERNAL PARALEGAL"]);
    // The two QA found in the list are not among them.
    assert.ok(!offered.includes("PRO BONO LAWYER"));
    assert.ok(!offered.some((r) => r.includes("NYSC")));
  }

  // Department heads are not unit heads and do not request: mirrors
  // policy.CanRequestUserMgmt, which an earlier copy of the list got wrong.
  for (const notRequester of [
    "CIVIL JUSTICE DEPT. HEAD", "CRIMINAL JUSTICE DEPT. HEAD",
    "DIRECTOR GENERAL", "PLATFORM ADMIN", undefined, null, "",
  ]) {
    assert.equal(isRequesterOffice(notRequester), false, String(notRequester));
    assert.equal(requestableRolesFor(notRequester), null);
  }
});

// The sentence QA asked for has to be the message, not a line under a generic
// headline (row 31).
test("row 31: the server's one reason is what the screen says", () => {
  const refusal =
    "We couldn't send your request. Please ask the pro bono lawyer to register on the LACON website.";

  assert.deepEqual(
    serverToast("The request could not be raised", { error: refusal }),
    { title: refusal }
  );
  assert.deepEqual(serverToast("Headline", refusal), { title: refusal });

  // A form's field errors are a list, and stay a list under the headline.
  const many = serverToast("Check the form", {
    email: ["Email is required"],
    phone: ["Phone is required"],
  });
  assert.equal(many.title, "Check the form");
  assert.equal(many.description, "Email is required, Phone is required");

  // Nothing specific: the headline carries it, and never an empty notice.
  assert.deepEqual(serverToast("Something failed", undefined), { title: "Something failed" });
  assert.deepEqual(serverToast(undefined, {}), { title: "Something went wrong" });
});

// QA 2026-11-16, row 43: the client's receipt was "still shown to lawyers,
// Decongestion, the DG and State Coordinators". It belongs to the paralegal who
// filed the case, who is the one with a client at the desk.
test("row 43: only the paralegal who filed the case is offered the receipt", () => {
  const paralegal = "8f14e45f-ceea-467a-9ba3-0ffd0f1f3e47";
  const someoneElse = "c4ca4238-a0b9-3382-8dcc-509a6f75849b";

  assert.equal(canPrintAcknowledgement(paralegal, paralegal), true);
  // Case and spacing are not a reason to refuse the person who filed it.
  assert.equal(canPrintAcknowledgement(paralegal.toUpperCase(), ` ${paralegal} `), true);

  assert.equal(canPrintAcknowledgement(paralegal, someoneElse), false);
  // A case filed before the filer was recorded, or a viewer we do not know,
  // is not an invitation to print the client's receipt.
  for (const [filer, viewer] of [
    [undefined, paralegal], [null, paralegal], ["", paralegal],
    [paralegal, undefined], [paralegal, null], [paralegal, "  "],
    [undefined, undefined],
  ]) {
    assert.equal(canPrintAcknowledgement(filer, viewer), false, `${filer} / ${viewer}`);
  }
});

// QA 2026-11-16, row 68: "Type 'zzz': the dropdown is empty with no message."
// An empty list because nobody is eligible and an empty list because the search
// matched nothing are different things and now say different things.
test("row 68: the picker says why it has nobody to offer", () => {
  assert.equal(
    pickerEmptyMessage("assign", "", "zzz"),
    "No lawyer matches that search."
  );
  assert.equal(
    pickerEmptyMessage("route", "STATE COORDINATOR", "zzz"),
    "No recipient matches that search."
  );
  // Whitespace is not a search.
  assert.equal(
    pickerEmptyMessage("assign", "", "   "),
    emptyPoolMessage("assign", "")
  );
  // With no search, it says what to do about an empty pool.
  assert.match(pickerEmptyMessage("assign", "", ""), /Add one under Lawyers/);
  assert.match(
    pickerEmptyMessage("route", "STATE COORDINATOR", ""),
    /No active state coordinator is available/
  );
  assert.equal(pickerEmptyMessage("escalate", "", ""), "No eligible recipients found.");
});

// QA 2026-11-16, row 71: Case Reviews sat under Users Role, beside Lawyers and
// Request. They are case updates, so they belong under Cases - and only for the
// offices that read them; everyone else keeps the direct link.
test("row 71: Case Reviews belongs to the offices that read them", () => {
  const caseRoles = [
    "DIRECTOR GENERAL", "PLATFORM ADMIN", "DECONGESTION UNIT HEAD",
    "STATE COORDINATOR", "LACON LAWYER", "INTERNAL PARALEGAL",
  ];
  const reviewRoles = ["DECONGESTION UNIT HEAD", "DIRECTOR GENERAL", "PLATFORM ADMIN", "ADMIN"];

  // The offices with reviews reach Cases through the sub-menu.
  assert.deepEqual(
    casesSubMenuRoles(caseRoles, reviewRoles),
    ["DECONGESTION UNIT HEAD", "DIRECTOR GENERAL", "PLATFORM ADMIN"]
  );
  // An office that may read reviews but has no Cases entry gets neither.
  assert.ok(!casesSubMenuRoles(caseRoles, reviewRoles).includes("ADMIN"));

  // Everyone else keeps the direct link, and a paralegal keeps "Filed Cases".
  const direct = casesDirectRoles(caseRoles, reviewRoles);
  assert.deepEqual(direct, ["STATE COORDINATOR", "LACON LAWYER"]);
  assert.ok(!direct.includes("INTERNAL PARALEGAL"));

  // Nobody is offered Cases twice.
  for (const role of casesSubMenuRoles(caseRoles, reviewRoles)) {
    assert.ok(!direct.includes(role), role);
  }
});

// QA 2026-11-16, row 65: the filter dropdowns opened the browser's own list -
// another font, no search, no order - and "Worked on by" listed 27 bare names
// with "no role or office, no search and no order".
test("row 65: a long filter list is searched and ordered on what is shown", () => {
  const people = [
    { label: "Zainab Bello", detail: "LACON Lawyer" },
    { label: "Adaobi Nwosu", detail: "State Coordinator · Lagos" },
    { label: "QA Decon", detail: "Decongestion Unit" },
  ];

  // In name order, so a name can be found.
  assert.deepEqual([...people].sort(byLabel).map(p => p.label),
    ["Adaobi Nwosu", "QA Decon", "Zainab Bello"]);

  // Found by name...
  assert.deepEqual(narrowOptions(people, "zainab").map(p => p.label), ["Zainab Bello"]);
  // ...and by the office written beside it, which is how two QA accounts are
  // told apart.
  assert.deepEqual(narrowOptions(people, "lagos").map(p => p.label), ["Adaobi Nwosu"]);
  assert.deepEqual(narrowOptions(people, "decongestion").map(p => p.label), ["QA Decon"]);
  // Case and spacing do not matter; an empty search narrows nothing.
  assert.equal(narrowOptions(people, "  ").length, 3);
  assert.deepEqual(narrowOptions(people, "  NWOSU ").map(p => p.label), ["Adaobi Nwosu"]);
  // And nothing matching returns nothing, which is what lets the control say so.
  assert.deepEqual(narrowOptions(people, "zzz"), []);

  assert.equal(matchesOption({ label: "Armed robbery" }, "robbery"), true);
  assert.equal(matchesOption({ label: "Armed robbery" }, "theft"), false);
  assert.equal(caseCount(1), "1 case");
  assert.equal(caseCount(4), "4 cases");
});

// QA 2026-11-16, row 72: a lawyer's limit was fixed when the account was made -
// a pro bono lawyer's "1 case at a time" - so a lawyer who could take more read
// as full, with nowhere to say otherwise.
test("row 72: a lawyer's own case load is a number they can read", () => {
  // Nought is how a LACON lawyer's account is set up: nobody has capped them.
  assert.equal(caseLoadLabel(0), "No set limit");
  assert.equal(caseLoadLabel(-3), "No set limit");
  assert.equal(caseLoadLabel(1), "1 case at a time");
  assert.equal(caseLoadLabel(6), "6 cases at a time");

  // What the API refuses, said before the change is sent.
  assert.equal(caseLoadProblem("6"), "");
  assert.equal(caseLoadProblem("0"), "");
  assert.match(caseLoadProblem(""), /Give the number/);
  assert.match(caseLoadProblem("many"), /whole number/);
  assert.match(caseLoadProblem("-1"), /whole number/);
  assert.match(caseLoadProblem("1.5"), /whole number/);
  assert.match(caseLoadProblem(String(MAX_CASE_LOAD + 1)), /cannot be more than 500/);
  assert.equal(caseLoadProblem(String(MAX_CASE_LOAD)), "");
});
