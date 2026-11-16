import { redirect } from "next/navigation";
import DesignationLetter from "@/features/usersRole/DesignationLetter";
import { getUser } from "@/server/auth";

/**
 * A pro bono lawyer's own Letter of Designation.
 *
 * The letter lived only under /users, which a pro bono lawyer may not open, so
 * the one person the letter is addressed to was sent away from it
 * (QA 2026-11-01 run 4, 13 Nov, row 39). The API accepts the lawyer's own
 * account id and now lets them read their own application.
 */
export default async function Page() {
  const userId = await getUser();
  if (!userId) redirect("/signin");
  return <DesignationLetter applicationId={userId} />;
}
