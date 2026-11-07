import test from "node:test";
import assert from "node:assert/strict";
import { casePermissions, filedFrom, movementReason, recordedUpdate, reviewerRole, standsInForFCT, statusLabel } from "../src/features/cases/domain.ts";
import { displayStateName } from "../src/lib/place-names.ts";
import { courtStageOptionsFor, courtStageLabel } from "../src/lib/form-options.ts";
import { pendingChangeNote, userStatusBadge } from "../src/lib/user-status.ts";
import { startOfWeek } from "../src/lib/week.ts";
import { roleLabel } from "../src/lib/role-labels.ts";
import { custodyDateMissing, isInCustody } from "../src/lib/custody.ts";
import { MAX_SHOWN, canReviewDuplicates, hasDuplicates, reasonProblem, sharedLabel, topMatches } from "../src/lib/duplicates.ts";
import { caseSourceLabel, caseSourceProblem, needsBroughtBy, needsVisitDetails } from "../src/lib/case-source.ts";
import { BULK_COLUMNS, BULK_COLUMN_COUNT, bulkTemplateCsv } from "../src/features/cases/bulk-template.ts";

// QA 2026-11-01, item 18: case_movements is append-only, so rows written before
// the backend started labelling statuses keep the raw codes.
test("legacy history reasons are read in words", () => {
  assert.equal(movementReason("ASSIGNED -> INPROGRESS"), "Assigned to lawyer → In progress");
  assert.equal(movementReason("COMPLETED -> CLOSED: all done"), "Completed → Closed: all done");
  assert.equal(movementReason("REVISION_REQUESTED -> INPROGRESS"), "Revision requested → In progress");
});
test("anything that is not a status change is left exactly as written", () => {
  for (const reason of [
    "Please take this PDSS matter.",
    "Assigned to lawyer → In progress: starting work",
    "unrouted: no active State Coordinator of Kano",
    "",
  ]) {
    assert.equal(movementReason(reason), reason);
  }
  assert.equal(movementReason(undefined), "");
  // A pair of unknown codes is not ours to rewrite.
  assert.equal(movementReason("FOO -> BAR"), "FOO -> BAR");
  assert.equal(statusLabel("INPROGRESS"), "In progress");
});

// QA 2026-11-01, item 12: the pro bono screens read the state off the record and
// showed "FCT" while the pickers spelled it out.
test("the FCT is spelled out wherever a state is shown", () => {
  for (const written of ["FCT", "fct", " F.C.T. ", "Abuja"]) {
    assert.equal(displayStateName(written), "Federal Capital Territory");
  }
  assert.equal(displayStateName("Lagos"), "Lagos");
  assert.equal(displayStateName(""), "");
  assert.equal(displayStateName(undefined), "");
});

// QA 2026-11-01, item 17: one criminal-flavoured list was offered to every case
// type, so a civil case was asked for its plea.
test("court stages follow the case type, as the API's catalog does", () => {
  const civil = courtStageOptionsFor("CIVIL CASE").map(o => o.value);
  const criminal = courtStageOptionsFor("CRIMINAL CASE").map(o => o.value);
  assert.ok(civil.includes("PLEADINGS"));
  assert.ok(civil.includes("EXECUTION"));
  assert.equal(civil.includes("ARRAIGNMENT_AND_PLEA"), false);
  assert.ok(criminal.includes("ARRAIGNMENT_AND_PLEA"));
  assert.ok(criminal.includes("SENTENCING"));
  assert.equal(criminal.includes("PLEADINGS"), false);
  // Both lists end with Other, as the API's does.
  assert.equal(civil.at(-1), "OTHER");
  assert.equal(criminal.at(-1), "OTHER");
  // Underscored case types arrive from some endpoints.
  assert.deepEqual(courtStageOptionsFor("criminal_case"), courtStageOptionsFor("CRIMINAL CASE"));
});
test("case types with no court proceedings offer no stages", () => {
  for (const caseType of ["PDSS STATION", "PDSS ORGANIZATION", "DECONGESTION UNIT", "MERCY APPLICATION", "", undefined]) {
    assert.deepEqual(courtStageOptionsFor(caseType), []);
  }
});
test("a stage code carries its own readable label", () => {
  assert.equal(courtStageLabel("CIVIL CASE", "PLEADINGS"), "Pleadings (statement of defence, reply)");
  assert.equal(courtStageLabel("CRIMINAL CASE", "SENTENCING"), "Sentencing");
  // Shared codes mean different things in the two lists.
  assert.notEqual(courtStageLabel("CIVIL CASE", "CONCLUDED"), courtStageLabel("CRIMINAL CASE", "CONCLUDED"));
  // An unknown code is shown as it is rather than hidden.
  assert.equal(courtStageLabel("CIVIL CASE", "SOMETHING_ELSE"), "SOMETHING_ELSE");
});

test("recorded updates read in words too", () => {
  assert.equal(
    recordedUpdate("Local LACON Lawyer changed the status to INPROGRESS"),
    "Local LACON Lawyer changed the status to In progress",
  );
  // An all-caps word that is not a status is left alone.
  assert.equal(recordedUpdate("Casefile assigned by LACON"), "Casefile assigned by LACON");
  assert.equal(recordedUpdate(undefined), "");
});

// QA 2026-11-01, item 5: a declined pro bono applicant is deactivated, so the
// user lists showed them as "Inactive" — the same as a suspended lawyer.
test("a declined applicant is told apart from a suspended lawyer", () => {
  assert.equal(userStatusBadge("INACTIVE", "DECLINED").label, "Declined");
  assert.equal(userStatusBadge("INACTIVE").label, "Inactive");
  assert.equal(userStatusBadge("SUSPEND").label, "Suspended");
  // An approved lawyer who was later deactivated is inactive, not declined.
  assert.equal(userStatusBadge("INACTIVE", "APPROVED").label, "Inactive");
  // A decision never contradicts an account that can still sign in.
  assert.equal(userStatusBadge("ACTIVE", "DECLINED").label, "Active");
  assert.equal(userStatusBadge("PENDING").label, "Pending");
  // Anything unmapped is shown as it arrived rather than hidden.
  assert.equal(userStatusBadge("SOMETHING").label, "SOMETHING");
  assert.equal(userStatusBadge(undefined).label, "");
});

// QA 2026-11-01, item 11: the bulk upload dialog posted nothing and said the
// feature did not exist, while POST /casefile/create-bulk-case had been
// working. That handler reads the CSV by column POSITION (row[0]..row[33]), so
// the template's order is the contract.
test("the bulk template matches the column contract the API reads", () => {
  assert.equal(BULK_COLUMN_COUNT, 34, "the Go handler's expectedCols is 34");
  assert.equal(BULK_COLUMNS.length, BULK_COLUMN_COUNT);
  // The positions the handler maps by name, spot-checked at both ends and at
  // the boundary between client details and court details.
  assert.equal(BULK_COLUMNS[0].header, "Case type");
  assert.equal(BULK_COLUMNS[3].header, "State");
  assert.equal(BULK_COLUMNS[5].header, "Gender");
  assert.equal(BULK_COLUMNS[19].header, "Number of dependants");
  assert.equal(BULK_COLUMNS[33].header, "Prosecuting agency");
  // Every column the API requires is marked, so the template can say so.
  const required = BULK_COLUMNS.filter(c => c.required).map(c => c.header);
  assert.deepEqual(required, ["Case type", "First name", "State", "Last name", "Gender"]);
});

// A quoted cell may hold a comma, so count the parsed row, not a naive split.
function csvCells(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { cells.push(cell); cell = ""; }
    else cell += char;
  }
  cells.push(cell);
  return cells;
}

test("the template is a header row and one example row", () => {
  const lines = bulkTemplateCsv().trimEnd().split("\n");
  assert.equal(lines.length, 2);
  for (const line of lines) {
    assert.equal(csvCells(line).length, BULK_COLUMN_COUNT, `"${line.slice(0, 40)}…" has the wrong column count`);
  }
  assert.deepEqual(csvCells(lines[0]), BULK_COLUMNS.map(c => c.header));
  assert.deepEqual(csvCells(lines[1]), BULK_COLUMNS.map(c => c.example));
});

test("a value holding a comma is quoted, so the columns do not shift", () => {
  const address = BULK_COLUMNS.find(c => c.header === "Permanent address");
  assert.ok(address.example.includes(","), "the example address exercises the escaping");
  assert.ok(bulkTemplateCsv().includes(`"${address.example}"`));
});

// QA 2026-11-01, item 25: a coordinator's screens.
test("a change still waiting on the Director General is said alongside the status", () => {
  assert.equal(pendingChangeNote("DEACTIVATE"), "Suspension requested");
  assert.equal(pendingChangeNote("REACTIVATE"), "Reactivation requested");
  // An ADD is never reported this way: the account it asks for does not exist yet.
  assert.equal(pendingChangeNote("ADD"), undefined);
  assert.equal(pendingChangeNote(""), undefined);
  assert.equal(pendingChangeNote(undefined), undefined);
});

test("a pending suspension does not change what the account's status says", () => {
  // The account really is still active until the DG decides, so the badge is
  // unchanged and the note is extra.
  assert.equal(userStatusBadge("ACTIVE").label, "Active");
  assert.equal(pendingChangeNote("DEACTIVATE"), "Suspension requested");
});

test("the week a case was filed in starts on the Monday, in local time", () => {
  // Wednesday 2026-10-28 -> Monday 2026-10-26.
  assert.equal(startOfWeek(new Date(2026, 9, 28, 14, 30)), "2026-10-26");
  // The Monday itself does not move.
  assert.equal(startOfWeek(new Date(2026, 9, 26, 9, 0)), "2026-10-26");
  // Sunday closes the week that began six days earlier, not the next one.
  assert.equal(startOfWeek(new Date(2026, 10, 1, 23, 59)), "2026-10-26");
  // Just after midnight: building the day from the local parts keeps it from
  // slipping back to the previous week east of UTC.
  assert.equal(startOfWeek(new Date(2026, 10, 2, 0, 30)), "2026-11-02");
  // Across the turn of a month and a year.
  assert.equal(startOfWeek(new Date(2027, 0, 1, 12, 0)), "2026-12-28");
});

// QA 2026-11-01, item 22: LACON confirmed DIO and Prerogative of Mercy are
// departments and Decongestion is a unit. Only the reading changes.
test("offices read as LACON names them, departments and units apart", () => {
  assert.equal(roleLabel("DIO UNIT HEAD"), "DIO Department Head");
  assert.equal(roleLabel("PREROGATIVE OF MERCY UNIT HEAD"), "Prerogative of Mercy Department Head");
  assert.equal(roleLabel("DECONGESTION UNIT HEAD"), "Decongestion Unit Head");
  assert.equal(roleLabel("OSCAR UNIT HEAD"), "OSCAR Unit Head");
  assert.equal(roleLabel("PDSS UNIT HEAD"), "PDSS Unit Head");
});

test("a role that is not ours is shown as it was stored", () => {
  assert.equal(roleLabel("SOMETHING NEW"), "SOMETHING NEW");
  assert.equal(roleLabel(""), "");
  assert.equal(roleLabel(undefined), "");
  assert.equal(roleLabel(null), "");
  // The stored form is upper case; a label never replaces it on the way back.
  assert.equal(roleLabel("state coordinator"), "State Coordinator");
});

// T19: the custody date is asked only of a client who is actually held.
test("the custody date is required only when the client is in custody", () => {
  // On bail, or not known: nothing is asked, and nothing blocks Submit.
  assert.equal(custodyDateMissing("BAILED", ""), undefined);
  assert.equal(custodyDateMissing("", ""), undefined);
  assert.equal(custodyDateMissing(undefined, undefined), undefined);
  // In custody with no date: blocked, and the message says what is wanted.
  assert.match(custodyDateMissing("UNBAILED", "") ?? "", /admitted into custody/);
  assert.match(custodyDateMissing("unbailed", "   ") ?? "", /admitted into custody/);
  // In custody with a date: fine.
  assert.equal(custodyDateMissing("UNBAILED", "2026-10-01"), undefined);
  assert.equal(isInCustody("UNBAILED"), true);
  assert.equal(isInCustody("BAILED"), false);
  assert.equal(isInCustody(undefined), false);
});

// T20: a case filed by a Lagos state paralegal read as "INTERNAL · HQ".
test("a case says which office it was filed from", () => {
  assert.equal(filedFrom({ filing_office: "Lagos State Office" }), "Lagos State Office");
  assert.equal(filedFrom({ filing_office: "Ikeja centre" }), "Ikeja centre");
  assert.equal(filedFrom({ filing_office: "Online · Lagos" }), "Online · Lagos");
  // Filed before the office was recorded: say so rather than guess.
  assert.match(filedFrom({ filing_office: "", origin_channel: "INTERNAL" }), /Not recorded/);
  assert.match(filedFrom({}), /Not recorded/);
  // An older online case can still be named from what it does carry.
  assert.equal(filedFrom({ origin_channel: "ONLINE", state_name: "Kano" }), "Online · Kano");
  assert.equal(filedFrom({ origin_channel: "online" }), "Online");
  // Whitespace is not an office.
  assert.match(filedFrom({ filing_office: "   ", origin_channel: "INTERNAL" }), /Not recorded/);
});

// T15: a case a coordinator had started work on could be moved by nobody but them.
test("the Director General can send any open case on", () => {
  const dg = { id: "dg-1", role: "DIRECTOR GENERAL" };
  const heldByCoordinator = {
    id: "c1", case_id: "LACON-1", first_name: "A", last_name: "B",
    case_type: "CIVIL CASE", status: "INPROGRESS",
    current_holder: { id: "sc-1", name: "A Coordinator", email: "", role: "STATE COORDINATOR" },
    assignment: { assignee_id: "lawyer-1", assignor_id: "sc-1" },
  };
  assert.equal(casePermissions(heldByCoordinator, dg).route, true);
  // Still not an assignment: the DG routes, it never assigns a lawyer.
  assert.equal(casePermissions(heldByCoordinator, dg).assign, false);
  // A closed case is nobody's to move.
  assert.equal(casePermissions({ ...heldByCoordinator, status: "CLOSED" }, dg).route, false);
  // And it is the DG's privilege alone: a head still needs to hold it.
  const head = { id: "h1", role: "OSCAR UNIT HEAD" };
  assert.equal(casePermissions(heldByCoordinator, head).route, false);
});

// T6: a case that left Legal Aid, or moved to another LACON office, had no
// status to say so, so it stayed open for ever.
test("a referred or transferred case is finished here", () => {
  assert.equal(statusLabel("REFERRED"), "Referred out");
  assert.equal(statusLabel("TRANSFERRED"), "Transferred");

  const holder = { id: "sc-1", role: "STATE COORDINATOR" };
  const mine = {
    id: "c1", case_id: "LACON-1", first_name: "A", last_name: "B",
    case_type: "CIVIL CASE", status: "INPROGRESS",
    current_holder: { id: "sc-1", name: "A Coordinator", email: "", role: "STATE COORDINATOR" },
  };
  // At any stage, unlike closing, which waits for the lawyer to finish.
  assert.equal(casePermissions(mine, holder).endCase, true);
  assert.equal(casePermissions(mine, holder).close, false);
  assert.equal(casePermissions({ ...mine, status: "SUBMITTED" }, holder).endCase, true);

  // Once it has gone, nothing more happens here.
  for (const status of ["REFERRED", "TRANSFERRED"]) {
    const gone = casePermissions({ ...mine, status }, holder);
    assert.equal(gone.endCase, false, `${status} should offer nothing`);
    assert.equal(gone.route, false);
    assert.equal(gone.assign, false);
  }

  // And it is not a lawyer's to do.
  const lawyer = { id: "lawyer-1", role: "LACON LAWYER" };
  assert.equal(casePermissions(mine, lawyer).endCase, false);
});

// T10: the same client filed twice. The warning has to show the filer the
// earlier case, not just say one exists, and the newest filing is the one most
// likely to be the same matter.
test("the duplicate warning shows the five newest matches", () => {
  const made = n => Array.from({ length: n }, (_, i) => ({
    reference: `LACON-2026-${String(i + 1).padStart(6, "0")}`,
    client_name: "Chidi Obi",
    filed_at: `2026-0${(i % 9) + 1}-01T09:00:00Z`,
    filing_office: "Lagos State Office",
    status: "UNASSIGNED",
    filed_by_name: "A Filer",
    filed_by_role: "INTERNAL PARALEGAL",
  }));

  // Newest first, whatever order the API answered in.
  const three = made(3);
  assert.deepEqual(
    topMatches(three).map(m => m.filed_at),
    ["2026-03-01T09:00:00Z", "2026-02-01T09:00:00Z", "2026-01-01T09:00:00Z"],
  );
  // The call does not reorder what it was given.
  assert.equal(three[0].filed_at, "2026-01-01T09:00:00Z");

  // Capped: eight matches are a list, not evidence.
  const eight = topMatches(made(8));
  assert.equal(eight.length, MAX_SHOWN);
  assert.equal(eight[0].filed_at, "2026-08-01T09:00:00Z");

  // Nothing found is not a warning.
  assert.equal(hasDuplicates([]), false);
  assert.equal(hasDuplicates(undefined), false);
  assert.equal(hasDuplicates(made(1)), true);
  assert.deepEqual(topMatches([]), []);
});

// T10: filing anyway is allowed, but a reviewer later reads the reason, so an
// empty or token answer is refused.
test("continuing past the warning needs a reason in words", () => {
  assert.match(reasonProblem("") ?? "", /why/i);
  assert.match(reasonProblem("   ") ?? "", /why/i);
  assert.match(reasonProblem("new one") ?? "", /detail/i);
  assert.equal(reasonProblem("Different landlord dispute, unrelated matter"), undefined);
});

// T5: the flag showed on a case, but there was no one place to review the
// flagged pairs. The view is review only, and only the platform admins and
// Statistics keep the national picture it serves.
test("the duplicates view belongs to the admins and Statistics", () => {
  for (const role of ["PLATFORM ADMIN", "SUPER ADMIN", "STATISTICS", "statistics"]) {
    assert.equal(canReviewDuplicates(role), true, role);
  }
  for (const role of ["DIRECTOR GENERAL", "STATE COORDINATOR", "INTERNAL PARALEGAL", "LACON LAWYER", "", undefined]) {
    assert.equal(canReviewDuplicates(role), false, String(role));
  }
});

// T5, criterion 2: a reviewer is told why a pair was flagged, not merely that
// it was — and never told a reason the API did not give.
test("a flagged pair says what the two cases share", () => {
  assert.equal(sharedLabel(["email"]), "same email");
  assert.equal(sharedLabel(["email", "phone number"]), "same email and phone number");
  assert.equal(sharedLabel([]), "");
  assert.equal(sharedLabel(["", null].filter(Boolean)), "");
});

// T17: the record said only how a case was entered — online or in an office —
// which is not where it came from.
test("a case source is read in words, including the ones never recorded", () => {
  assert.equal(caseSourceLabel("WALK_IN"), "Walk-in at LACON office");
  assert.equal(caseSourceLabel("custodial_visit"), "Detention / custodial centre visit");
  assert.equal(caseSourceLabel("ONLINE"), "Online (public website)");
  // Filed before this was asked: say so rather than guess.
  assert.equal(caseSourceLabel(""), "Not recorded (filed before this change)");
  assert.equal(caseSourceLabel(undefined), "Not recorded (filed before this change)");
  // A source we do not know is shown as it was stored, not hidden.
  assert.equal(caseSourceLabel("FROM THE MOON"), "FROM THE MOON");
});

test("only a walk-in client brought themselves", () => {
  assert.equal(needsBroughtBy("WALK_IN"), false);
  assert.equal(needsBroughtBy("ONLINE"), false);
  assert.equal(needsBroughtBy(""), false);
  for (const source of ["CUSTODIAL_VISIT", "COURT_REFERRAL", "ORGANISATION_REFERRAL", "OTHER"]) {
    assert.equal(needsBroughtBy(source), true, source);
  }
  assert.equal(needsVisitDetails("CUSTODIAL_VISIT"), true);
  assert.equal(needsVisitDetails("COURT_REFERRAL"), false);
});

// T17, criteria 2 and 3: a visit nobody can place is not a record.
test("the filer is told what is missing before the case is sent", () => {
  assert.deepEqual(caseSourceProblem({}), { case_source: "Say where this case came from." });
  assert.deepEqual(caseSourceProblem({ case_source: "WALK_IN" }), {});
  assert.deepEqual(Object.keys(caseSourceProblem({ case_source: "COURT_REFERRAL" })), ["brought_by"]);
  assert.deepEqual(caseSourceProblem({ case_source: "COURT_REFERRAL", brought_by: "Barr. A. Musa, LACON lawyer" }), {});
  assert.deepEqual(
    Object.keys(caseSourceProblem({ case_source: "CUSTODIAL_VISIT", brought_by: "welfare officer" })),
    ["facility_name", "visit_date"],
  );
  assert.deepEqual(
    caseSourceProblem({ case_source: "CUSTODIAL_VISIT", brought_by: "welfare officer", facility_name: "Kuje Custodial Centre", visit_date: "2026-10-31" }),
    {},
  );
  // Whitespace is not an answer.
  assert.deepEqual(Object.keys(caseSourceProblem({ case_source: "OTHER", brought_by: "   " })), ["brought_by"]);
});

// T12: the FCT office works like a state office since 6 Nov 2026. Its public
// civil and criminal filings used to go to the HQ Civil and Criminal Justice
// heads, because the FCT had no coordinator of its own.
test("an FCT case is reviewed by the FCT coordinator", () => {
  for (const state of ["FCT", "Federal Capital Territory", "Abuja"]) {
    assert.equal(reviewerRole({ case_type: "CIVIL CASE", state_name: state }), "STATE COORDINATOR");
    assert.equal(reviewerRole({ case_type: "CRIMINAL CASE", state_name: state }), "STATE COORDINATOR");
  }
  // Nothing about other states or other case types changed.
  assert.equal(reviewerRole({ case_type: "CIVIL CASE", state_name: "Lagos" }), "STATE COORDINATOR");
  assert.equal(reviewerRole({ case_type: "PDSS ORGANIZATION", state_name: "FCT" }), "PDSS UNIT HEAD");
  assert.equal(reviewerRole({ case_type: "DECONGESTION", state_name: "Lagos" }), undefined);
});

// T12, criterion 4: the cases already with the HQ heads stay there, and a case
// nobody can decide is a case nobody can close.
test("an HQ justice head may still decide the FCT case they hold", () => {
  assert.equal(standsInForFCT({ case_type: "CIVIL CASE", state_name: "FCT" }, "CIVIL JUSTICE DEPT. HEAD"), true);
  assert.equal(standsInForFCT({ case_type: "CRIMINAL CASE", state_name: " abuja " }, "CRIMINAL JUSTICE DEPT. HEAD"), true);
  // Not the other head, not another state, not another case type.
  assert.equal(standsInForFCT({ case_type: "CIVIL CASE", state_name: "FCT" }, "CRIMINAL JUSTICE DEPT. HEAD"), false);
  assert.equal(standsInForFCT({ case_type: "CIVIL CASE", state_name: "Lagos" }, "CIVIL JUSTICE DEPT. HEAD"), false);
  assert.equal(standsInForFCT({ case_type: "PDSS ORGANIZATION", state_name: "FCT" }, "CIVIL JUSTICE DEPT. HEAD"), false);
});
