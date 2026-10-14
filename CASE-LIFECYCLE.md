# Frontend case lifecycle and validation

Implemented against lacon-shared `cc175e7` and lacon-backend `307ee85`.

- `/cases` supports all cases in role scope, personal queue and cases awaiting assignment, plus reference/name, status, type and filing-state filters.
- `/cases/{uuid}` loads the exact case, movement timeline and documents. References use `case_id`; old records fall back to the full UUID.
- Routing uses `POST /casefile/{id}/route`; assigning a lawyer uses the assignment PATCH. DG never gets lawyer options. The target picker follows the backend role matrix.
- The lawyer picker uses the case-specific assignable-lawyers API, supports search/pagination, and displays live workload/capacity. Pro bono scoping remains with the backend.
- Return, escalation, rejection, revision and reassignment collect a reason. Actions depend on role, current holder, assignor/assignee and workflow status. Backend authorization remains authoritative.
- Online submissions require accept/reject before routing/assignment. Lawyer start/completion and coordinator closure use the status endpoint. Revision requests are answered through progress updates.
- Uploads use the authenticated server API client, support the backend file types and cap size at 10 MB. The Server Action body limit allows 11 MB for multipart overhead.
- Successful writes refresh case, history, document, queue and dashboard queries. Transfers/returns navigate to the case list because the caller may lose access.
- The deprecated lawyer-details intake tab was removed from the lawyer dashboard. Upcoming events remain available; external-paralegal mediation is preserved.

## Checks

`npm run test:cases` exercises 18 permission and API-contract scenarios. TypeScript and targeted lint cover the new implementation. Browser QA uses a disposable local fixture and does not contact the deployed API.

To reproduce local browser QA (Node 22.18+):

1. Run `node tests/fixtures/case-api.mjs`.
2. Run `NEXT_BASE_URL=http://127.0.0.1:4317 NEXT_PUBLIC_BASE_URL=http://127.0.0.1:4317 ALGORITHM=HS256 SECRET_KEY=lacon-local-case-qa-secret npm run dev -- --port 4318 --hostname 127.0.0.1`.
3. Open `http://127.0.0.1:4318/signin`. Use `coordinator@example.test`, `lawyer@example.test` or `dg@example.test`, with any password. All records are in memory; restart the fixture to reset.

The fixture checks frontend request/response behavior, not PostgreSQL queries, real email delivery or deployment configuration. Run staging acceptance tests once the matching backend release is deployed.

## Backend dependencies found during implementation

- No endpoint exposes saved `case_updates` text/files. The detail page shows movement history and available `updated_by` entries, not a complete progress-update timeline.
- `CasefileResponse` omits filing timestamps and geographic IDs/names. Filing time falls back to the first FILE movement; missing location values are not inferred from the client's state of origin.
- `DocumentUploadResponseMap` includes document IDs, but omits `casefile_id`; the response DTO also lacks timestamps. Documents can be opened by their returned URL. Populate the history case ID and add timestamps in the backend; zero IDs in a synthetic fixture are not evidence of a deployed missing-ID defect.
- `FindAll` still scopes internal paralegals by `created_by` instead of `filing_actor`, and the legacy `CheckForUnitHead` list still omits DIO. These can affect the deployed queue; frontend changes cannot repair those queries.
- Existing user-request approval semantics, pro bono source/letter generation, notifications, activity/session logs and report drill-down remain separate work.

The shared handoff and backend acceptance criteria are published in [lacon-shared/CASE-LIFECYCLE.md](https://github.com/Devon-Technologies-LTD/lacon-shared/blob/main/CASE-LIFECYCLE.md) and backend issues #23–#26 (shared commit `4100a71`). Local fixture QA is not a live-staging sign-off.
