import test from "node:test";
import assert from "node:assert/strict";
import { emptyPoolMessage, pickerEmptyMessage } from "../src/lib/recipient-picker.ts";

// QA 2026-11-19, row 79: with no active Centre Coordinator, the DG's Route case
// pop-up told the Director General to "assign a lawyer instead, or ask the
// Director General to create one". The DG cannot assign lawyers, and is the
// Director General. The advice now follows who is reading it.
test("row 79: the empty-pool advice fits what the viewer can do", () => {
  const dg = pickerEmptyMessage("route", "CENTRE COORDINATOR", "", "DIRECTOR GENERAL");
  assert.match(dg, /No active centre coordinator is available/);
  assert.match(dg, /Users Role > New User/);
  // Neither piece of advice the DG cannot act on survives.
  assert.doesNotMatch(dg, /ask the Director General/);
  assert.doesNotMatch(dg, /Assign a lawyer instead/);

  // An office that can neither create accounts nor is the DG keeps the old
  // advice, which is right for it.
  const head = pickerEmptyMessage("route", "CENTRE COORDINATOR", "", "DECONGESTION UNIT HEAD");
  assert.match(head, /ask the Director General to create one/);

  // Case and spacing in the stored role must not decide this.
  assert.equal(
    emptyPoolMessage("route", "CENTRE COORDINATOR", " director general "),
    emptyPoolMessage("route", "CENTRE COORDINATOR", "DIRECTOR GENERAL")
  );

  // A search that matched nothing still says so, whoever is looking.
  assert.equal(
    pickerEmptyMessage("route", "CENTRE COORDINATOR", "zzz", "DIRECTOR GENERAL"),
    "No recipient matches that search."
  );

  // An unknown viewer, and a caller that passes none at all, keep the message
  // every other office reads.
  assert.equal(
    emptyPoolMessage("route", "ZONAL DIRECTOR"),
    emptyPoolMessage("route", "ZONAL DIRECTOR", "INTERNAL PARALEGAL")
  );
});
