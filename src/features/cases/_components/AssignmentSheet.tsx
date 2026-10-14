import { Dispatch, SetStateAction } from "react";
import { ICase } from "./table-columns";
import CaseWorkspace from "./CaseWorkspace";

export function AssignmentSheet({ details }: { details: ICase | null; type: string; setOpen: Dispatch<SetStateAction<boolean>> }) {
  return details ? <CaseWorkspace id={details.id} /> : <p>No case selected.</p>;
}
