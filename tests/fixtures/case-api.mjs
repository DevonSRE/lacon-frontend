// Local browser-QA fixture. No requests are forwarded to the real LACON API.
// Run: node tests/fixtures/case-api.mjs (binds only to 127.0.0.1:4317).
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const uuid = n => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const users = [
  [1, "dg", "DIRECTOR GENERAL"], [2, "coordinator", "STATE COORDINATOR"],
  [3, "lawyer", "LACON LAWYER"], [4, "volunteer", "PRO BONO LAWYER"],
  [5, "civil", "CIVIL JUSTICE DEPT. HEAD"], [6, "centre", "CENTRE COORDINATOR"],
  [7, "zonal", "ZONAL DIRECTOR"], [8, "pdss", "PDSS UNIT HEAD"],
].map(([n, name, role]) => ({ id: uuid(n), first_name: name[0].toUpperCase() + name.slice(1), last_name: "Tester", name: `${name} Tester`, email: `${name}@example.test`, user_type: role, role, status: "ACTIVE", state: "Lagos", state_id: uuid(50), zone_id: uuid(51), max_load: 5, open_cases: 2 }));
const actor = u => ({ id: u.id, name: `${u.first_name} ${u.last_name}`, role: u.user_type, email: u.email });
const cases = [
  [101, "Public", "SUBMITTED", users[1]], [102, "Routing", "UNASSIGNED", users[0]],
  [103, "Assigned", "ASSIGNED", users[2]], [104, "Completed", "COMPLETED", users[2]],
].map(([n, name, status, holder]) => ({ id: uuid(n), case_id: `LACON-2026-${String(n).padStart(6, "0")}`, first_name: name, last_name: "Client", case_type: "CIVIL CASE", status,
  gender: "female", age: 35, email: "client@example.test", phone_number: "08001234567", permanent_address: "Example street", state_of_origin: "Ogun",
  state_name: "Lagos", state_id: uuid(50), origin_channel: n === 101 ? "ONLINE" : "INTERNAL", filed_level: n === 102 ? "HQ" : "STATE", current_holder: actor(holder),
  filing_actor: { id: uuid(9), name: n === 101 ? "Online submitter" : "Intake Tester", role: n === 101 ? "PUBLIC" : "INTERNAL PARALEGAL", email: "intake@example.test" },
  civil_case: { complaint: "Example civil complaint", defendant_address: "Example address", defendant_email: "defendant@example.test" },
  possible_duplicate_of: n === 101 ? ["LACON-2026-000103"] : [],
  assignment: n >= 103 ? { assignor_id: users[1].id, assignor: users[1].name, assignee_id: users[2].id, assignee: users[2].name, assign_date: "2026-10-14T09:00:00Z" } : null,
  assigned_by: n >= 103 ? users[1].name : "", updated_by: [],
}));
const histories = new Map(cases.map(c => [c.id, [{ id: randomUUID(), casefile_id: c.id, action: "FILE", from_holder: null, to_holder: c.current_holder, actor: c.filing_actor, reason: "", created_at: "2026-10-14T08:00:00Z" }]]));
const documents = new Map();
const paginate = (data, query) => { const page = Number(query.get("page") || 1), size = Number(query.get("size") || 20); return { data: data.slice((page - 1) * size, page * size), total_rows: data.length, total_pages: Math.max(1, Math.ceil(data.length / size)), page, size }; };
const token = user => `${Buffer.from(JSON.stringify({ alg: "none" })).toString("base64url")}.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, fixture_user_id: user.id })).toString("base64url")}.fixture`;
const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:4317"), path = url.pathname.replace("/api/v1", "");
  const chunks = []; for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  let body = {}; try { body = JSON.parse(raw || "{}"); } catch {}
  const send = (data, status = 200) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify({ data, success: status < 400, message: status < 400 ? "Success" : "Fixture request failed" })); };
  const fail = message => { res.writeHead(400, { "Content-Type": "application/json" }); res.end(JSON.stringify({ success: false, message: "Cannot update case", error: [message] })); };
  if (path === "/auth/login") {
    const user = users.find(u => u.email === body.email);
    if (!user) return send(null, 401);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ID: user.id, ...user, state_name: "Lagos", zone_name: "South West", token: token(user) }));
  }
  let user;
  try { const payload = JSON.parse(Buffer.from((req.headers.authorization || "").replace(/^Bearer /, "").split(".")[1], "base64url").toString()); user = users.find(u => u.id === payload.fixture_user_id); } catch {}
  if (!user) return send(null, 401);
  if (path === "/users/assignable-lawyers") return send(paginate(users.filter(u => ["LACON LAWYER", "PRO BONO LAWYER"].includes(u.user_type)), url.searchParams));
  if (path === "/users") return send(paginate(users.filter(u => !url.searchParams.get("user_type") || u.user_type === url.searchParams.get("user_type")), url.searchParams));
  if (path.startsWith("/users/") && path.endsWith("/events")) return send([]);
  if (path === "/analytics/admin") return send({ cases_summation: { totalCases: cases.length, pendingAssignments: 2, weeklyCivilAndCriminal: 4, probonoApplications: 0 }, case_overview: cases, case_distributions: [] });
  if (path === "/casefile") {
    let rows = cases.filter(c => user.role === "DIRECTOR GENERAL" || !["LACON LAWYER", "PRO BONO LAWYER"].includes(user.role) || c.assignment?.assignee_id === user.id);
    const q = url.searchParams;
    if (q.get("queue") === "mine" || q.get("queue") === "unassigned") rows = rows.filter(c => c.current_holder?.id === user.id);
    if (q.get("queue") === "unassigned") rows = rows.filter(c => !c.assignment && ["SUBMITTED", "UNASSIGNED", "ROUTED", "RETURNED"].includes(c.status));
    for (const key of ["status", "case_type"]) if (q.get(key) && q.get(key) !== "all") rows = rows.filter(c => c[key] === q.get(key));
    if (q.get("search") && q.get("search") !== "all") rows = rows.filter(c => `${c.first_name} ${c.last_name} ${c.case_id}`.toLowerCase().includes(q.get("search").toLowerCase()));
    return send(paginate(rows, q));
  }
  const caseId = path === "/admin/casefile/case-assignment" ? body.casefile_id : path.match(/(?:admin\/)?casefile\/([^/]+)/)?.[1];
  const c = cases.find(c => c.id === caseId);
  if (!c) return send(null, 404);
  if (["LACON LAWYER", "PRO BONO LAWYER"].includes(user.role) && c.assignment?.assignee_id !== user.id) return send(null, 404);
  if (req.method === "GET") {
    if (path.endsWith("/history")) return send(paginate(histories.get(c.id), url.searchParams));
    if (path.endsWith("/document-history")) return send(paginate(documents.get(c.id) || [], url.searchParams));
    return send(c);
  }
  const from = c.current_holder;
  let movement = "";
  if (["CLOSED", "DENIED"].includes(c.status)) return fail("This case is closed.");
  if (path.endsWith("/accept")) { c.status = "UNASSIGNED"; movement = "ACCEPT"; }
  else if (path.endsWith("/reject")) { if (!body.reason?.trim()) return fail("a reason is required"); c.status = "DENIED"; movement = "REJECT"; }
  else if (path.endsWith("/route")) { const target = users.find(u => u.id === body.target_user_id); if (!target) return fail("Choose a recipient"); c.current_holder = actor(target); c.status = "ROUTED"; movement = "ROUTE"; }
  else if (path.endsWith("/escalate")) { if (!body.reason?.trim()) return fail("a reason is required"); c.current_holder = actor(users.find(u => u.id === body.target_user_id) || users[0]); c.status = "RETURNED"; movement = "ESCALATE"; }
  else if (path.endsWith("/case-assignment")) {
    if (c.assignment && !body.reason?.trim()) return fail("a reason is required for a reassignment");
    const target = users.find(u => u.id === body.assignee_id); if (!target) return fail("Choose a lawyer");
    c.assignment = { assignor_id: user.id, assignor: user.name, assignee_id: target.id, assignee: target.name, assign_date: new Date().toISOString() };
    c.assigned_by = user.name; c.current_holder = actor(target); c.status = "ASSIGNED"; movement = "ASSIGN";
  } else if (path.endsWith("/request-revision")) { if (!body.reason?.trim()) return fail("a reason is required"); c.status = "REVISION_REQUESTED"; movement = "REVISION"; }
  else if (path.endsWith("/lawyer-reject")) { if (!body.reason?.trim()) return fail("a reason is required"); c.current_holder = actor(users.find(u => u.id === c.assignment.assignor_id)); c.assignment = null; c.status = "RETURNED"; movement = "RETURN"; }
  else if (path.endsWith("/case-status-update")) { c.status = body.status; if (body.status === "CLOSED") movement = "CLOSE"; }
  else if (path.endsWith("/case-update")) { if (c.status === "REVISION_REQUESTED") c.status = "INPROGRESS"; c.updated_by.push({ ...actor(user), action: "Lawyer added a progress update", time: new Date().toISOString() }); }
  else return send(null, 404);
  if (movement) histories.get(c.id).push({ id: randomUUID(), casefile_id: c.id, action: movement, from_holder: from, to_holder: c.current_holder, actor: actor(user), reason: body.reason || "", created_at: new Date().toISOString() });
  return send(c);
});
server.listen(4317, "127.0.0.1", () => console.log("Case QA fixture: http://127.0.0.1:4317. Test emails: coordinator@example.test, dg@example.test, lawyer@example.test. Any password."));
