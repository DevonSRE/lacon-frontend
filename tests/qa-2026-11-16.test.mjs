import test from "node:test";
import assert from "node:assert/strict";
import { apiMessage } from "../src/lib/api-message.ts";

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
