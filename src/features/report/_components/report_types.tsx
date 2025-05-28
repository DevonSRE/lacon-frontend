export type StateData = {
    state: string;
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

export type VisualReportProps = {
    stateData: StateData[];
    lawyersData: LawyerData[];
};