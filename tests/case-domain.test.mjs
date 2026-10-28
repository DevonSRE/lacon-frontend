import test from "node:test";
import assert from "node:assert/strict";
import { casePermissions, routeRoles, normalizeCase, statusLabel } from "../src/features/cases/domain.ts";

const holder = { id: "holder", role: "STATE COORDINATOR" };
const lawyer = { id: "lawyer", role: "LACON LAWYER" };
const base = { id: "case", case_id: "LACON-2026-000001", first_name: "Test", last_name: "Client", case_type: "CIVIL CASE", status: "UNASSIGNED", current_holder: { ...holder, name: "Coordinator", email: "holder@example.test" } };
const assigned = { ...base, status: "ASSIGNED", current_holder: { ...lawyer, name: "Lawyer", email: "lawyer@example.test" }, assignment: { assignor_id: holder.id, assignee_id: lawyer.id } };

test("DG routes to every head/coordinator and never assigns a lawyer", () => {
  const dg = { id: "dg", role: "DIRECTOR GENERAL" };
  const permissions = casePermissions({ ...base, current_holder: { ...dg } }, dg);
  assert.equal(permissions.route, true);
  assert.equal(permissions.assign, false);
  assert.equal(routeRoles(dg.role).includes("DIO UNIT HEAD"), true);
  assert.equal(routeRoles(dg.role).includes("CENTRE COORDINATOR"), true);
  assert.equal(routeRoles(dg.role).includes("LACON LAWYER"), false);
});
test("coordinators route one level down; centre assigns only", () => {
  assert.deepEqual(routeRoles("ZONAL DIRECTOR"), ["STATE COORDINATOR"]);
  assert.deepEqual(routeRoles("STATE COORDINATOR"), ["CENTRE COORDINATOR"]);
  assert.deepEqual(routeRoles("CENTRE COORDINATOR"), []);
  assert.equal(casePermissions({ ...base, current_holder: null }, { id: "centre", role: "CENTRE COORDINATOR" }).assign, true);
});
test("viewing a case does not grant movement rights", () => {
  const p = casePermissions(base, { id: "other", role: "STATE COORDINATOR" });
  assert.equal(p.assign, false); assert.equal(p.route, false); assert.equal(p.escalate, false);
  assert.equal(p.acceptReject, false);
  assert.equal(casePermissions(base, undefined).assign, false);
});
test("online case requires acceptance before routing or assignment", () => {
  const submitted = { ...base, status: "SUBMITTED" };
  const p = casePermissions(submitted, holder);
  assert.equal(p.acceptReject, true); assert.equal(p.assign, false); assert.equal(p.route, false);
  assert.equal(casePermissions({ ...submitted, case_type: "PDSS ORGANIZATION" }, holder).acceptReject, false);
  const pdss = { id: "pdss", role: "PDSS UNIT HEAD" };
  assert.equal(casePermissions({ ...submitted, case_type: "PDSS ORGANIZATION", current_holder: { ...pdss } }, pdss).acceptReject, true);
});
test("FCT online cases are reviewed by the HQ Civil and Criminal Justice heads", () => {
  const civilHead = { id: "civil", role: "CIVIL JUSTICE DEPT. HEAD" };
  const criminalHead = { id: "criminal", role: "CRIMINAL JUSTICE DEPT. HEAD" };
  const fctCivil = { ...base, status: "SUBMITTED", case_type: "CIVIL CASE", state_name: "FCT", current_holder: { ...civilHead } };
  assert.equal(casePermissions(fctCivil, civilHead).acceptReject, true);
  assert.equal(casePermissions({ ...fctCivil, current_holder: { ...criminalHead } }, criminalHead).acceptReject, false);
  assert.equal(casePermissions({ ...fctCivil, case_type: "CRIMINAL CASE", state_name: "Federal Capital Territory", current_holder: { ...criminalHead } }, criminalHead).acceptReject, true);
  // Outside the FCT a head does not review civil cases.
  assert.equal(casePermissions({ ...fctCivil, state_name: "Lagos" }, civilHead).acceptReject, false);
});
test("assigner can reassign and request revision while lawyer holds case", () => {
  const p = casePermissions(assigned, holder);
  assert.equal(p.assign, true); assert.equal(p.revision, true); assert.equal(p.update, false);
  assert.equal(casePermissions(assigned, { id: "other", role: "STATE COORDINATOR" }).revision, false);
});
test("only assigned lawyer starts/completes/returns work", () => {
  const p = casePermissions(assigned, lawyer);
  assert.equal(p.start, true); assert.equal(p.complete, true); assert.equal(p.lawyerReject, true); assert.equal(p.update, true);
  assert.equal(p.close, false); assert.equal(p.assign, false);
  assert.equal(casePermissions({ ...assigned, status: "INPROGRESS" }, lawyer).start, false);
  assert.equal(casePermissions({ ...assigned, status: "REVISION_REQUESTED" }, lawyer).start, true);
});
test("completed case closes only through its assigning/holding coordinator", () => {
  const completed = { ...assigned, status: "COMPLETED" };
  assert.equal(casePermissions(completed, holder).close, true);
  assert.equal(casePermissions(completed, lawyer).close, false);
  assert.equal(casePermissions(completed, { id: "other", role: "STATE COORDINATOR" }).close, false);
});
test("terminal cases offer no writes", () => {
  for (const status of ["CLOSED", "DENIED"]) {
    for (const user of [holder, lawyer]) assert.equal(Object.values(casePermissions({ ...assigned, status }, user)).some(Boolean), false);
  }
});
test("normalize model/DTO fields and readable status without conflating court stage", () => {
  const pdss = { offence: "Test offence" };
  assert.deepEqual(normalizeCase({ ...base, pdss_station: pdss }).pdss, pdss);
  assert.deepEqual(normalizeCase({ ...base, perogative: { reason_for_clemency: "Test" } }).perogative_of_mercy, { reason_for_clemency: "Test" });
  assert.equal(statusLabel("SUBMITTED"), "Pending review");
  assert.equal(statusLabel("REVISION_REQUESTED"), "Revision requested");
});
test("the DG can pick up an online case nobody holds", () => {
  const dg = { id: "dg", role: "DIRECTOR GENERAL" };
  const unrouted = { ...base, status: "SUBMITTED", case_type: "CIVIL CASE", state_name: "Kano", current_holder: null };
  const p = casePermissions(unrouted, dg);
  assert.equal(p.acceptReject, true); assert.equal(p.route, true);
  // Once a coordinator holds it, the DG no longer decides it.
  assert.equal(casePermissions({ ...unrouted, current_holder: { id: "sc", name: "SC", email: "", role: "STATE COORDINATOR" } }, dg).acceptReject, false);
});
