
export interface ICase {
    id: string;
    filed_date: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    status: string;
    filed_by: string;
    state: string;
    case_type: string; // e.g., "PDSS ORGANIZATION" or "CIVIL CASE"
    case_title: string; // e.g., "PDSS ORGANIZATION" or "CIVIL CASE"
    location: string; // General location
    name: string;
    sex: string;
    age: number;
    marital_status: string;
    disability: string; // From disability_status
    phone_number: string;
    email: string;
    occupation: string;
    state_of_origin: string;
    assignment: {
        assignee_id: string;
        assignee: string;
        assign_date: string;
        assignor_id: string;
        assignor: string;
    }
}
