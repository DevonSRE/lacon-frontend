import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import { invitationScope, paralegalDepartment, uniqueRoleOptions } from "../src/lib/user-invitation-options.ts";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const exports = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL("../src/features/dashboard/server/type.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports, require: name => name === "@/lib/user-invitation-options" ? { invitationScope, paralegalDepartment } : require(name) });
const person = { first_name: "Synthetic", last_name: "Tester", email: "tester@example.test", phone_number: "08000001015" };
const id = "00000000-0000-4000-8000-000000000050";

test("role picker removes duplicate/empty/invalid options without mutating API data", () => {
  const input = ["ZONAL DIRECTOR", "LACON LAWYER", "ZONAL DIRECTOR", null, "", " "];
  assert.deepEqual(uniqueRoleOptions(input), ["LACON LAWYER", "ZONAL DIRECTOR"]);
  assert.equal(input.length, 6);
  assert.deepEqual(uniqueRoleOptions(null), []);
});
test("uppercase coordinator roles require valid location IDs on the correct error keys", () => {
  for (const [role, key] of [["STATE COORDINATOR", "state_id"], ["ZONAL DIRECTOR", "zone_id"], ["CENTRE COORDINATOR", "center_id"]]) {
    const result = exports.createUserSchema.safeParse({ ...person, user_type: role });
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some(issue => issue.path[0] === key));
  }
  assert.equal(exports.createUserSchema.safeParse({ ...person, user_type: "CENTRE COORDINATOR", state_id: id, center_id: "Center A" }).success, false);
});
test("all lawyer designations require state; centre designation also requires a real centre", () => {
  for (const user_type of ["LACON LAWYER", "PRO BONO LAWYER"]) {
    for (const designation of ["State Lawyer", "Centre Lawyer", "Zonal Lawyer", "Head Quarter"]) {
      assert.equal(exports.createUserSchema.safeParse({ ...person, user_type, designation }).success, false);
      const result = exports.createUserSchema.safeParse({ ...person, user_type, designation, state_id: id, ...(designation === "Centre Lawyer" ? { center_id: id } : {}) });
      assert.equal(result.success, true);
    }
  }
});
test("unused blank locations are omitted rather than sent as invalid UUIDs", () => {
  const result = exports.createUserSchema.safeParse({ ...person, user_type: "DIO UNIT HEAD", state_id: "", zone_id: "", center_id: "" });
  assert.equal(result.success, true);
  assert.equal(result.data.state_id, undefined);
  assert.equal(result.data.zone_id, undefined);
  assert.equal(result.data.center_id, undefined);
});

function centerApi(pages, failure = false) {
  const calls = [];
  const api = {};
  const axiosInstance = { get: async (path, config) => {
    calls.push({ path, params: config.params });
    if (failure) throw new Error("Network failed");
    return { data: { success: true, data: { data: pages[config.params.page - 1], total_pages: pages.length } } };
  } };
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL("../src/features/usersRole/invitation-actions.ts", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports: api, require: name => name === "@/lib/_api/axios-config" ? { axiosInstance } : require(name) });
  return { api, calls };
}
// The state is now the server's filter, not ours: /centers takes a state id,
// and sending the state means one page instead of every centre in the country
// (QA 2026-11-01, item 1). The paging loop stays, because the page size is the
// API's promise and a state with more centres than one page would lose the rest.
test("centre picker asks the API for one state and reads every page it is given", async () => {
  const first = "00000000-0000-4000-8000-000000000051";
  const second = "00000000-0000-4000-8000-000000000052";
  const { api, calls } = centerApi([
    [{ id: first, title: "Abia Centre", state_id: id }],
    [{ id: "Center A", title: "Placeholder", state_id: id }, { id: second, title: "Second Centre", state_id: id }],
  ]);
  const result = await api.getInvitationCenters(id);
  assert.equal(result.success, true);
  // Both real centres, in title order; the row whose id is not an id is dropped.
  // Compared element-wise: the array comes from another vm realm, so a strict
  // deep-equal against a plain array fails on the prototype alone.
  assert.equal(result.data.length, 2);
  assert.equal(result.data[0].title, "Abia Centre");
  assert.equal(result.data[1].title, "Second Centre");
  assert.equal(calls.length, 2);
  assert.ok(calls.every(call => call.path === "/centers" && call.params.size === 100 && !call.params.status));
  // Every page asks for the one state, so the API does the filtering.
  assert.ok(calls.every(call => call.params.state === id));
});
test("invalid state never queries centres", async () => {
  const { api, calls } = centerApi([[]]);
  assert.equal((await api.getInvitationCenters("Abia")).success, false);
  assert.equal(calls.length, 0);
});
test("centre fetch errors are not reported as a valid empty list", async () => {
  const { api } = centerApi([[]], true);
  assert.equal((await api.getInvitationCenters(id)).success, false);
});

test("an internal paralegal can belong to a centre or a unit (QA 2026-10-26 item 2)", () => {
  const paralegal = { ...person, user_type: "INTERNAL PARALEGAL" };
  // Centre Office needs the state and the centre.
  assert.equal(exports.createUserSchema.safeParse({ ...paralegal, designation: "Centre Office", state_id: id }).success, false);
  assert.equal(exports.createUserSchema.safeParse({ ...paralegal, designation: "Centre Office", state_id: id, center_id: id }).success, true);
  // A unit needs no place and is sent as the unit's department.
  const unit = exports.createUserSchema.safeParse({ ...paralegal, designation: "PDSS Unit", state_id: "", zone_id: "", center_id: "" });
  assert.equal(unit.success, true);
  assert.equal(unit.data.department_name, "PDSS UNIT HEAD");
  assert.equal(unit.data.state_id, undefined);
  // An office that is a place sends no department.
  const state = exports.createUserSchema.safeParse({ ...paralegal, designation: "State Office", state_id: id });
  assert.equal(state.success, true);
  assert.equal(state.data.department_name, undefined);
  assert.equal(paralegalDepartment("LACON LAWYER", "PDSS Unit"), "");
});
