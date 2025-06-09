export type StateData = {
    state: string;
    first_name: string;
    last_name: string;
    received: number;
    accepted: number;
    completed: number;
    activeParalegals: number;
};

export type LawyerData = {
    name: string;
    casesGranted: number;
    completed: number;
    roles: string;
};

export type LaconLawyer = {
    stateData: StateData[];
    lawyersData: LawyerData[];
};
export type VisualReportProps = {
    stateData: StateData[];
    lawyersData: LawyerData[];
};