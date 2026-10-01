# QA status report: `feat/demo`

**Date:** 2026-10-01
**Scope:** frontend QA of `feat/demo` against the PRD and the earlier QA report, using every test account from the credentials sheet.
**Branch:** all work committed locally (one commit per fix). Push pending.
**Backend issues:** see [BACKEND-ISSUES.md](BACKEND-ISSUES.md).

## Done: frontend fixes

### Items from the earlier QA report

| QA item | Status |
|---|---|
| 1. Cases created but never reach the actioning queue | **Fixed.** The Cases page called a route that doesn't exist (`/api/cases`; the bug is also on `main`), so no role except internal paralegal could load its queue. Verified: an HQ paralegal filing now appears in DG's queue. |
| 2. PDSS, Civil Justice, DIO unit-head pages don't load | **Fixed.** The app expected the role names "PDSS" / "DIO", but the API sends "PDSS UNIT HEAD" / "DIO UNIT HEAD". Civil Justice was the Cases-page bug above. |
| 2. DIO can't create a paralegal | **Fixed.** DIO can add External Paralegals. Civil Head, State/Centre Coordinators and Zonal Director can now add Internal Paralegals (a logic bug had hidden the option). |
| 3. Users tab: search by email, role filter | **Fixed.** Search matches email; the role filter no longer keeps applying an old search. |
| 3. Role-request tab missing the requester's role | **Column added.** It fills in once the backend sends the role (BACKEND-ISSUES #7). |
| 3. Unit heads can't request/add roles | **Partly.** See "paralegal" above; which other heads may add paralegals is a product decision. |
| 4. T&C link goes nowhere | **Pending:** needs T&C text or a URL from LACON. |
| 4. Invite email doesn't match template | **Backend** (BACKEND-ISSUES #9). |

### Security
- **Pages restricted by role.** Previously any logged-in user could open any page by URL (e.g. a lawyer could see all users and lawyers' phone numbers).
- **Credentials kept out of the browser.** Password hashes and one-time codes sent by the API are stripped before they reach the page.
- **Logs cleaned up.** Login tokens, passwords, OTPs and citizens' case details are no longer written to server logs.

### Case flow
- Department/unit heads can assign a case to a lawyer or forward it to another head. The lawyer list shows only active lawyers.
- Lawyers see the client's name, phone and next hearing; "Update Progress" and "Upload" work.
- "Assigned By" is filled in; Assign or Re Assign shows depending on the case status.
- Filing: "Back" no longer leaves the page; "View This Case" works; the Decongestion form marks its required fields and scrolls to the first error.
- Centre Coordinator gets a scoped dashboard instead of the national one.

### UI
- Fixed: sideways scrolling on phones, the collapsed sidebar, fake chart labels, the missing "Other Cases" total on Reports, unnamed dialogs/buttons, a typo.

## Pending

### Backend team (details in BACKEND-ISSUES.md)
1. **P0:** user endpoints return password hashes and live one-time codes.
2. **P0:** the API doesn't check roles.
3. **P1:** forwarding a case to another head never arrives.
4. **P1:** cases aren't scoped to the right state/department.
5. **P1:** analytics numbers contradict each other.
6. **P1:** no endpoint for a lawyer to reject/return a case.
7. **P2:**
   - add the requester's role to role requests
   - the public filing key is visible in the browser
   - the invite email template
   - three broken test logins
8. **P3:** `defendant_address` holds an email.

### Product decisions
- Terms & Conditions text or link.
- Restore the disability fields on the Civil and PDSS forms? This branch removed them; the PRD requires them.
- Public form "Who is filing?" step (also needs an API field).
- Which heads may add paralegals.

### Still to verify
- Online filing reaching DG, on the deployed site (the local `.env` has no public filing key).
- Zonal Director and External Paralegal, once working test logins exist.

### Housekeeping
- Push `feat/demo` and open a PR.
- `pnpm-workspace.yaml` (pnpm placeholder): run `pnpm approve-builds` or delete it.
- Delete the 6 "QA TEST …" cases from the shared backend.
