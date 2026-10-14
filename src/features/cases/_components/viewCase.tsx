import { ICase } from "./table-columns";
import CaseWorkspace from "./CaseWorkspace";

export default function ViewCase({ details }: { details: ICase | null }) {
  return details ? <CaseWorkspace id={details.id} /> : <p>No case selected.</p>;
}
