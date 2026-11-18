import test from "node:test";
import assert from "node:assert/strict";
import { apiMessage } from "../src/lib/api-message.ts";
import { rejectReasonProblem } from "../src/lib/decision-reason.ts";

// QA 2026-11-16, row 19: "Rejecting a request shows only 'successfully'
// instead of 'Request rejected.'" The API had been saying it all along; the
// screen replaced it with a word of its own.
test("row 19: the API's own words reach the person who acted", () => {
  assert.equal(apiMessage("Request rejected", "Done"), "Request rejected");
  assert.equal(apiMessage("Request approved", "Done"), "Request approved");

  // Only a genuinely empty answer falls back, and never to "successfully".
  for (const empty of [undefined, null, "", "   ", 0, {}, []]) {
    assert.equal(apiMessage(empty, "Done"), "Done");
  }

  assert.equal(apiMessage("  Request rejected  ", "Done"), "Request rejected");
});

// QA 2026-11-16, row 55: "Reject with an empty note is blocked, but nothing
// tells the DG a reason is needed." The dialog disabled its own button and
// said nothing, so the click read as a fault.
test("row 55: an empty rejection note says what is needed", () => {
  assert.equal(
    rejectReasonProblem(""),
    "Enter a reason to reject this request."
  );
  assert.equal(
    rejectReasonProblem("   \n  "),
    "Enter a reason to reject this request."
  );
  // A reason given means nothing is in the way.
  assert.equal(rejectReasonProblem("Duplicate of an earlier request"), undefined);
});
