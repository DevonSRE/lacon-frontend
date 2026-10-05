# Backend issues found during frontend QA

Found while testing `feat/demo` against `https://api.lacon.devontech.io/api/v1` on 2026-09-30 / 2026-10-01, using the test accounts from the testing-credentials sheet. All paths below are relative to `/api/v1`.

Each item says what happens, how to reproduce it, what we expect, and whether the frontend has a stop-gap.

| # | Priority | Issue |
|---|---|---|
| 1 | **P0 security** | User endpoints return password hashes and live OTPs |
| 2 | **P0 security** | API does not enforce roles |
| 3 | **P1** | Forwarding a case to another head never reaches them |
| 4 | **P1** | Case queues are not scoped to the right state / department |
| 5 | **P1** | Analytics numbers contradict each other |
| 6 | **P1** | Missing endpoint: lawyer rejects / returns a case |
| 7 | P2 | Missing field: requester's role on role requests |
| 8 | **P0** | Online case filing is down: no API key is configured |
| 9 | P2 | Invite email does not match the approved template |
| 10 | P2 | Test accounts that don't work or are mislabelled |
| 11 | P3 | `defendant_address` holds an email |
| 12 | **P1** | Lawyers can't update case progress: `LaconCaseType` required |

---

## 1. User endpoints return password hashes and live OTPs (P0)

**What happens:** `GET /users/get-user-by-type?type=lawyers` and `?type=unit_heads` return full user rows. Every row includes `Password` (a 60-character bcrypt hash), `Otp` (6 digits), `OtpExpiresAt` and `IsOtpVerify`. The frontend loads this list whenever a head opens **Assign** on a case, so any unit head received every listed user's hash and current OTP in their browser. Of the 31 users returned, 14 had a hash and all 31 had an OTP.

`GET /users`, `/users/lawyers` and the login / invite responses probably serialize the same model. Please check every endpoint that returns a user.

**Why it matters:** if `Otp` is the code used for password reset or invite acceptance, anyone who can open the Assign sheet can take over other accounts.

**Expected:** user responses never include `Password`, `Otp`, `OtpExpiresAt` or `IsOtpVerify`. Use a response DTO rather than the DB model.

**Also do:** invalidate all outstanding OTPs. Consider forcing a password reset for accounts whose hashes were exposed (low urgency for bcrypt, but they were sent to clients).

**Frontend stop-gap (done):** every API client now strips these keys server-side before data reaches the browser (`src/lib/_api/sanitize.ts`). This hides them in the UI but does not fix the API: anyone calling the API directly still gets them.

## 2. API does not enforce roles (P0)

**What happens:** signed in as a **LACON Lawyer** (`jolajames@`), these returned `200` with full data:

- `GET /users`: every user's name, email and role
- `GET /users/lawyers`: lawyers' names and phone numbers
- `GET /users/lawyer-unit-request`: all role requests

**Expected:** the API checks the caller's role on every endpoint. The PRD's role table is the source of truth: only Admin / Platform Admin / DG manage users, and lawyers see only their own assigned cases.

**Frontend stop-gap (done):** middleware now redirects roles away from pages they shouldn't see (`src/lib/route-access.ts`). It only hides the UI; the API is still open.

## 3. Forwarding a case to another head never reaches them (P1)

This is your QA report's "case assignment is broken" item. Most of that report's symptoms were a frontend bug (the Cases queue page never loaded, now fixed). This one is on the API.

**Repro:**

1. As the **Prerogative of Mercy head** (`prerogative@`), file a Mercy Application.
2. Assign it to **Jeremiah Jones, Criminal Justice Dept. Head**:
   ```
   PATCH /admin/casefile/case-assignment
   { "casefile_id": "5569d1ff-5e72-4006-80df-194e6d69e6c5",
     "assignee_id": "dde63d46-a6cb-4034-a3a3-77b68640debb",
     "is_reassigned": false }
   ```
3. The response is `200 "Casefile assigned successfully"` and status becomes `ASSIGNED`, but `department_name` is still `"PREROGATIVE OF MERCY UNIT HEAD"`.
4. Sign in as the Criminal Justice head: `GET /casefile` returns nothing and the dashboard shows 0 cases.

Reproduced twice, with `is_reassigned` true and false.

**Works:** assigning to a **lawyer** (Decongestion head → Jola James; Mercy head → Jola James) does reach the lawyer.

**Expected:** when the assignee is another department or unit head, the case moves into that department's queue (`department_name` / routing updated). PRD: "Any Unit head or Department head is able to send to another unit head or department head for assigning."

## 4. Case queues are not scoped to the right state or department (P1)

PRD: cases filed in a state go to that state's coordinator; HQ and online filings go to DG.

| Seen | Expected |
|---|---|
| The FCT State Coordinator (`fctstatecord@`) sees "Beulah Johnson", which DG's list shows as an **Anambra** case. | Coordinators see only their state's cases. |
| An HQ internal paralegal (`azucha@`) filing a civil case with "filing from: FCT" shows up in **both** DG's queue and the FCT coordinator's queue. | One owner. Confirm whether HQ paralegal filings go to DG only, as the PRD says. |
| The State column for that case shows **Abia** (client's state of origin), not FCT (where it was filed). | Return the filing state separately from `state_of_origin`. |
| `get-user-by-type?type=lawyers` returns lawyers from every state when called by a State Coordinator. | Scope to the caller's state/zone, or accept a `state_id` filter. |
| The DIO Unit Head (`dio90@`) sees Mercy and Decongestion cases (10 rows), while their dashboard says 0 total. | Confirm DIO's intended scope; the dashboard and list should agree. |
| Online / paralegal-filed cases have `forwarded_by: "user"`. | Return the filer's role or "ONLINE" so the "Assigned By" column means something. |

## 5. Analytics numbers contradict each other (P1)

From `GET /analytics/admin-overview` as Platform Admin:

- `case_reports`: Received **6**, Accepted 0, Completed 0, Criminal 7, Civil 13, Other 35. Criminal + Civil + Other = **55**, so "Received" is clearly counting something else (it matches the "July to December" bi-annual figure of 6).
- The monthly "cases received" series peaks at **32 in August**, which also doesn't match Received = 6.
- "Case Breakdown by State" has a row with an **empty state name** (5 received).
- The admin dashboard shows 49 total / 48 pending (fetched earlier, before new QA cases).

**Expected:** "Cases Received" equals the total number of cases in the selected period; the monthly series, bi-annual table and per-state table sum to it; cases without a state are labelled (e.g. "Unknown / Online").

**Frontend (done):** the Reports page now shows the "Other Cases" count, which it was dropping.

## 6. Missing endpoint: lawyer rejects / returns a case (P1)

PRD §4–5 and the App Flow ("Lawyer can reject/return case with reason; triggers reassignment by coordinator or dept head"). No endpoint exists, so the frontend's "Escalate Case" menu item was a dead button and has been removed.

**Needed:** e.g. `POST /casefile/{id}/return` with `{ reason }`. It should set status back to unassigned (or "RETURNED"), record the reason in `assignment_tracker`, and put the case back in the assigning head's queue.

## 7. Missing field: requester's role on role requests (P2)

From your QA report: on DG/Admin → Users → Request, there's no way to tell which unit a request came from. `GET /users/lawyer-unit-request` items have `RequestedByID` and `RequestedName` but no role.

**Needed:** add `RequestedByRole` (the requester's `UserType`, e.g. `"CIVIL JUSTICE DEPT. HEAD"`). The frontend already has a **Requester Role** column reading that exact field; it shows "-" until the API sends it.

## 8. Online case filing is down: no API key is configured (P0)

`POST /casefile/create-public-case` (the public website's "File a Case") answers `401 {"error":"API key required"}`. The frontend had no key to send: it read `NEXT_PUBLIC_CASE_API_KEY`, which isn't set in `.env`, and production uses the same environment. So every online filing from the website currently fails with "Something went wrong".

**Needed from backend:** the API key for the public case-filing endpoint.

**Then set it** as `CASE_API_KEY` in `.env` and in Vercel. The frontend now reads that **server-only** variable, so the key is never sent to browsers. The old `NEXT_PUBLIC_` name would have been compiled into the public JavaScript.

**Also recommended:** rate limiting / CAPTCHA on this endpoint, since anyone can submit to it through the website.

## 9. Invite email does not match the approved template (P2)

From your QA report. The PRD specifies:

> Hello (Name),
> You have been invited as a (role) to the Legal Aid Application. Kindly click the button below to complete Onboarding.
> We are excited to have you onboard!
> PS. Please ignore if you are not suppose to receive this mail.

## 10. Test accounts that don't work or are mislabelled (P2)

These block testing of whole roles:

- `dionew@yopmail.com`: "invalid email or password" with the sheet's password. `dio90@` works as DIO Unit Head.
- Zonal Director `oscarlac@yopmail.com` and External Paralegal `eparalegal@yopmail.com`: login fails. The sheet lists no password for either.
- `sambol@yopmail.com` is listed as PDSS Unit Head in the sheet but is an **ADMIN** in the app. `prigod@` is the real PDSS Unit Head.

Also: test accounts are on yopmail, whose inboxes are public. Fine for throwaway data, but invite and reset emails to them can be read by anyone.

## 11. `defendant_address` holds an email (P3)

The civil case forms label this field "Defendant's Email Address" (input type email) but send it as `defendant_address`. Confirm which the API expects. If it's an address, the frontend label is wrong; if it's an email, the field should be renamed.

---

### Not backend: needs a product decision

Listed here so they're tracked:

- **Terms & Conditions:** the invitation screen's "Accept terms and conditions" has no link and the repo has no T&C content. Needs the text or a URL from LACON.
- **Disability fields:** this branch removed `disability_status` / `disability_proof` from the Civil and PDSS forms; the PRD requires "Disability (if yes, upload proof)".
- **Public filing "Who is filing?" step** (Pro bono lawyer / Nigerian / PDSS LaCoN Lawyer / PDSS Organisation) from the PRD isn't built. It needs an API field to store the answer.
- **Paralegal onboarding by unit heads:** Civil Head, State/Centre Coordinators, Zonal Director and DG can now add Internal Paralegals, and DIO can add External Paralegals. Decide whether Criminal Justice, Mercy, OSCAR, PDSS and Decongestion heads should too.

## 12. Lawyers can't update case progress: `LaconCaseType` required (P1)

**Repro:** as a LACON Lawyer (`jolajames@`), open an assigned case → **Edit Case** → fill Court Progress, Next Steps and Status → **Update**.

```
POST /admin/casefile/{id}/case-update
{ "id": "<case id>", "casefile_id": "<case id>", "court_progress": "...",
  "next_step": "...", "current_status": "In Progress" }
→ 400 {"message":"Validation Failed","data":{"LaconCaseType":"This field is required"}}
```

We tried sending `lacon_case_type`, `LaconCaseType`, `laconCaseType` and `case_type` (with the case's type as the value); all were still rejected.

**Needed:** the JSON key and allowed values for `LaconCaseType`, or make it optional / derive it from the case. Until then no lawyer can record progress (PRD §4, "Lawyer: I want to update case progress").

(Fixed on the frontend: the form used to send whatever the lawyer typed as "Court ID" in `casefile_id`, which caused `400 "Error Parsing Request"`. It now sends the case's ID automatically.)
