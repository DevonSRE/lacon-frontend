export interface ICase {
    id: string;
    case_id?: string;
    filed_date?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    status?: string;
    filed_by?: string;
    state?: string;
    case_type?: string;
    case_title?: string;
    location?: string;
    name?: string;
    sex?: string;
    age?: number;
    marital_status?: string;
    disability?: string;
    phone_number?: string;
    email?: string;
    occupation?: string;
    state_of_origin?: string;
    assignment?: {
        assignee_id: string;
        assignee: string;
        assign_date: string;
        assignor_id: string;
        assignor: string;
    };
    // Additional fields from JSON
    gender?: string;
    department_name?: string;
    forwarded_by?: string;
    decongestion_unit?: {
        offence_charged?: string;
        offence_charged_description?: string;
        remand_date?: string;
        next_adjournment?: string;
    };
    perogative_of_mercy?: {
        sentence_passed?: string;
        reason_for_clemency?: string;
    };
    permanent_address?: string;
    updated_by?: Array<{
        id: string;
        name: string;
        email: string;
        role: string;
        time: string;
        action: string;
    }>;
    assignment_tracker?: Array<{
        assignor: string;
        assignee: string;
        date: string;
        note: string;
        status: string;
    }>;
}