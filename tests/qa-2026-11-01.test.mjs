import test from "node:test";
import assert from "node:assert/strict";
import { movementReason, recordedUpdate, statusLabel } from "../src/features/cases/domain.ts";
import { displayStateName } from "../src/lib/place-names.ts";
import { courtStageOptionsFor, courtStageLabel } from "../src/lib/form-options.ts";
import { userStatusBadge } from "../src/lib/user-status.ts";
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
