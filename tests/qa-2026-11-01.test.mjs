import test from "node:test";
import assert from "node:assert/strict";
import { movementReason, recordedUpdate, statusLabel } from "../src/features/cases/domain.ts";
import { displayStateName } from "../src/lib/place-names.ts";
import { courtStageOptionsFor, courtStageLabel } from "../src/lib/form-options.ts";

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
