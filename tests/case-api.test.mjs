import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import { normalizeCase } from "../src/features/cases/domain.ts";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const code = ts.transpileModule(readFileSync(new URL("../src/features/cases/server/lifecycle.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const id = "00000000-0000-4000-8000-000000000101";
const recipient = "00000000-0000-4000-8000-000000000003";
const record = { id, case_id: "LACON-2026-000101", status: "UNASSIGNED", first_name: "Test", last_name: "Client", case_type: "CIVIL CASE" };
function setup(response = record, error) {
  const calls = [];
  const request = async (method, ...args) => {
    calls.push({ method, args });
    if (error) throw error;
    return { data: { success: true, data: args[0].startsWith("/media") ? "https://example.test/uploads/order.pdf" : response } };
  };
  const axiosInstance = Object.fromEntries(["get", "post", "patch"].map(method => [method, (...args) => request(method, ...args)]));
  const exports = {};
  vm.runInNewContext(code, { exports, Blob, FormData, Error, Object, require: name => {
    if (name === "@/lib/_api/axios-config") return { axiosInstance };
    if (name === "@/lib/form-options") return { CASE_UPDATE_TYPES: ["MEDIATIONS", "CASE IN COURT", "LEGAL ADVICE"] };
    if (name === "../domain") return { normalizeCase };
    return require(name);
  } });
  return { api: exports, calls };
}
test("routing uses the movement endpoint, not lawyer assignment", async () => {
  const { api, calls } = setup();
  assert.equal((await api.moveCase(id, { action: "route", target_user_id: recipient })).success, true);
  assert.equal(calls[0].method, "post");
  assert.equal(calls[0].args[0], `/casefile/${id}/route`);
  assert.equal(calls[0].args[1].target_user_id, recipient);
  assert.equal(calls[0].args[1].assignee_id, undefined);
});
test("reassignment carries its reason to the PATCH contract", async () => {
  const { api, calls } = setup();
  await api.moveCase(id, { action: "assign", assignee_id: recipient, reason: "Capacity conflict" });
  assert.equal(calls[0].method, "patch");
  assert.equal(calls[0].args[0], "/admin/casefile/case-assignment");
  assert.equal(calls[0].args[1].casefile_id, id);
  assert.equal(calls[0].args[1].reason, "Capacity conflict");
});
test("reason-required movements reject blanks before making requests", async () => {
  for (const action of ["escalate", "reject", "lawyer-reject", "request-revision"]) {
    const { api, calls } = setup();
    assert.equal((await api.moveCase(id, { action, reason: "   " })).success, false);
    assert.equal(calls.length, 0);
  }
});
test("all movement and status endpoints use the documented methods", async () => {
  for (const action of ["accept", "reject", "escalate", "lawyer-reject", "request-revision", "status"]) {
    const { api, calls } = setup();
    const result = await api.moveCase(id, { action, reason: "Test reason", ...(action === "status" ? { status: "COMPLETED" } : {}) });
    assert.equal(result.success, true);
    assert.equal(calls[0].args[0], action === "status" ? `/admin/casefile/${id}/case-status-update` : `/casefile/${id}/${action}`);
  }
});
test("invalid identifiers do not reach the API", async () => {
  const { api, calls } = setup();
  assert.equal((await api.moveCase("not-an-id", { action: "accept" })).success, false);
  assert.equal((await api.getCase("../users")).success, false);
  assert.equal(calls.length, 0);
});
test("lawyer selection sends the case id, search and pagination", async () => {
  const { api, calls } = setup({ data: [], total_rows: 0, total_pages: 1, page: 2, size: 20 });
  await api.getAssignees(id, 2, "James");
  assert.equal(calls[0].args[0], "/users/assignable-lawyers");
  assert.equal(calls[0].args[1].params.case_id, id);
  assert.equal(calls[0].args[1].params.page, 2);
  assert.equal(calls[0].args[1].params.keyword, "James");
});
test("API movement error array is shown instead of a generic success", async () => {
  const { api } = setup(null, { response: { status: 403, data: { message: "Could not move", error: ["This case belongs to another holder"] } } });
  const result = await api.moveCase(id, { action: "accept" });
  assert.equal(result.success, false); assert.equal(result.status, 403);
  assert.equal(result.message, "This case belongs to another holder");
});
test("progress sends case_update_type and uploads through the authenticated client", async () => {
  const { api, calls } = setup();
  const form = new FormData();
  for (const [key, value] of Object.entries({ court_progress: "Court adjourned", next_step: "Attend hearing", current_status: "Hearing/Trial", case_update_type: "CASE IN COURT" })) form.set(key, value);
  form.set("file", new Blob(["fixture"], { type: "application/pdf" }), "order.pdf");
  assert.equal((await api.postCaseProgress(id, form)).success, true);
  assert.equal(calls[0].args[0], "/media?category=documents");
  assert.equal(calls[1].args[0], `/admin/casefile/${id}/case-update`);
  assert.equal(calls[1].args[1].case_update_type, "CASE IN COURT");
  assert.equal(calls[1].args[1].supporting_documents, "https://example.test/uploads/order.pdf");
  assert.equal(calls[1].args[1].casefile_id, id);
});
test("empty document upload fails before a document record is posted", async () => {
  const { api, calls } = setup();
  const form = new FormData(); form.set("document_title", "Order"); form.set("document_type", "Court order");
  const result = await api.postCaseDocument(id, form);
  assert.equal(result.success, false); assert.equal(calls.length, 0);
});
