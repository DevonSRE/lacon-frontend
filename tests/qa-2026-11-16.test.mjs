import test from "node:test";
import assert from "node:assert/strict";
import { apiMessage } from "../src/lib/api-message.ts";
import { rejectReasonProblem } from "../src/lib/decision-reason.ts";
import { isRequesterOffice, requestableRolesFor } from "../src/lib/requestable-roles.ts";
import { serverToast } from "../src/lib/server-toast.ts";
import { canPrintAcknowledgement } from "../src/lib/acknowledgement.ts";

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

// QA 2026-11-16, row 31: "Message is still the old long text, not the wording
// in Expected. The Role list still offers Pro bono and NYSC Lawyer."
test("row 31: an office is only offered the roles it may ask for", () => {
  // The five unit heads and the three place offices raise requests.
  for (const office of [
    "DECONGESTION UNIT HEAD", "PREROGATIVE OF MERCY UNIT HEAD", "OSCAR UNIT HEAD",
    "PDSS UNIT HEAD", "DIO UNIT HEAD", "ZONAL DIRECTOR", "STATE COORDINATOR",
    "CENTRE COORDINATOR",
  ]) {
    assert.equal(isRequesterOffice(office), true, office);
    const offered = requestableRolesFor(office);
    assert.deepEqual(offered, ["LACON LAWYER", "INTERNAL PARALEGAL", "EXTERNAL PARALEGAL"]);
    // The two QA found in the list are not among them.
    assert.ok(!offered.includes("PRO BONO LAWYER"));
    assert.ok(!offered.some((r) => r.includes("NYSC")));
  }

  // Department heads are not unit heads and do not request: mirrors
  // policy.CanRequestUserMgmt, which an earlier copy of the list got wrong.
  for (const notRequester of [
    "CIVIL JUSTICE DEPT. HEAD", "CRIMINAL JUSTICE DEPT. HEAD",
    "DIRECTOR GENERAL", "PLATFORM ADMIN", undefined, null, "",
  ]) {
    assert.equal(isRequesterOffice(notRequester), false, String(notRequester));
    assert.equal(requestableRolesFor(notRequester), null);
  }
});

// The sentence QA asked for has to be the message, not a line under a generic
// headline (row 31).
test("row 31: the server's one reason is what the screen says", () => {
  const refusal =
    "We couldn't send your request. Please ask the pro bono lawyer to register on the LACON website.";

  assert.deepEqual(
    serverToast("The request could not be raised", { error: refusal }),
    { title: refusal }
  );
  assert.deepEqual(serverToast("Headline", refusal), { title: refusal });

  // A form's field errors are a list, and stay a list under the headline.
  const many = serverToast("Check the form", {
    email: ["Email is required"],
    phone: ["Phone is required"],
  });
  assert.equal(many.title, "Check the form");
  assert.equal(many.description, "Email is required, Phone is required");

  // Nothing specific: the headline carries it, and never an empty notice.
  assert.deepEqual(serverToast("Something failed", undefined), { title: "Something failed" });
  assert.deepEqual(serverToast(undefined, {}), { title: "Something went wrong" });
});

// QA 2026-11-16, row 43: the client's receipt was "still shown to lawyers,
// Decongestion, the DG and State Coordinators". It belongs to the paralegal who
// filed the case, who is the one with a client at the desk.
test("row 43: only the paralegal who filed the case is offered the receipt", () => {
  const paralegal = "8f14e45f-ceea-467a-9ba3-0ffd0f1f3e47";
  const someoneElse = "c4ca4238-a0b9-3382-8dcc-509a6f75849b";

  assert.equal(canPrintAcknowledgement(paralegal, paralegal), true);
  // Case and spacing are not a reason to refuse the person who filed it.
  assert.equal(canPrintAcknowledgement(paralegal.toUpperCase(), ` ${paralegal} `), true);

  assert.equal(canPrintAcknowledgement(paralegal, someoneElse), false);
  // A case filed before the filer was recorded, or a viewer we do not know,
  // is not an invitation to print the client's receipt.
  for (const [filer, viewer] of [
    [undefined, paralegal], [null, paralegal], ["", paralegal],
    [paralegal, undefined], [paralegal, null], [paralegal, "  "],
    [undefined, undefined],
  ]) {
    assert.equal(canPrintAcknowledgement(filer, viewer), false, `${filer} / ${viewer}`);
  }
});
