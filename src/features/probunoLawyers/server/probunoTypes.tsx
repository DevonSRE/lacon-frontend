export type ProbunoInventoryFormData = {
    first_name: string;
    last_name: string;
    principal_name: string;
    lawyers_count_in_firm: number;
    law_firm_address: string;
    email: string;
    phone_number: string;
    alternate_number: string;
    year_of_call: string;
    nba_branch: string;
    experience_in_criminal_law: string;
    pro_bono_capacity: string;
    criminal_courts_preference: string[];
    areas_covered: string;
    client_base: string;
    source_of_clients: string;
    preferredCourts: string[];
    clientTypes: string[];
    referralSources: string[];
    agree: boolean;
};


export const checkboxFields = ['preferredCourts', 'clientTypes', 'referralSources'] as const;

export type CheckboxField = typeof checkboxFields[number];



export type ProBonoFormDataMain = {
    first_name: string;
    last_name?: string;
    state_of_practice: string;
    email: string;
    phone_number: string;
    alternate_number: string;
    state_bar_membership: string;
    name_of_law_firm_organization: string;
    law_firm_organization_address: string;
    most_contactable_call_no: string;
    experience_in_criminal_law: string;
    pro_bono_capacity: string;
}

export type ProBonoFormData = {
    criminal_courts_preference: string[];
    agree: boolean;
} & ProBonoFormDataMain;



export interface ProBonoCase {
    id: string;
    client_name: string;
    sex: string;
    date_case_taken: string;
    nature_of_service: string;
    offering_charge: string;
    suit_number: string;
    status_of_case: string;
    last_date_of_appearance: string;
    is_client_in_custody: boolean;
}
export interface FormErrors {
    [key: string]: string
}


export interface FormDataProbunoUpdate {
    first_name: string;
    last_name: string;
    email: string;
    contact_address: string;
    phone_number: string;
    cases: ProBonoCase[];
}
