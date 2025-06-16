import { z } from 'zod';

export const proBonoSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),

  lawyers_count_in_firm: z.number().optional(),
  law_firm_address: z.string().min(1).optional(),
  email: z.string().email(),
  state_id: z.string().uuid(),
  phone_number: z.string(),
  alternate_number: z.string(),
  year_of_call: z.string().min(4).max(4).optional(),
  nba_branch: z.string().min(1).optional(),
  experience_in_criminal_law: z.enum([
    'Below 2 years',
    '2-5 years',
    '5-10 years',
    'Above 10 years',
  ]),
  pro_bono_capacity: z.enum([
    '1 case at a time',
    '2 cases at a time',
    '3-4 cases at a time',
    '5 or more cases at a time',
  ]),
  criminal_courts_preference: z.array(
    z.enum([
      'Appellate Courts',
      'High Courts',
      'Magistrate Courts',
      'Customary Court',
      'Sharia Court',
      'Area Court',
    ])
  ),
  areas_covered: z.string().min(1).optional(),
  client_base: z.string().min(1).optional(),
  source_of_clients: z.string().min(1).optional(),
});

export type TProbunoFormPayload = z.infer<typeof proBonoSchema>;


export const probunoInventoryCaseformSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  lawyers_count_in_firm: z.coerce.number(),
  law_firm_address: z.string().min(1),
  email: z.string().email(),
  phone_number: z.string(),
  alternate_number: z.string().optional(),
  state_id: z.string(),
  year_of_call: z.string().min(4).max(4),
  experience_in_criminal_law: z.string().min(1),
  pro_bono_capacity: z.string().min(1),
  areas_covered: z.string().min(1),
  preferred_courts: z.array(z.string()),
  client_types: z.array(z.string()),
  referral_sources: z.array(z.string()),
});

export type TProbunoInventoryCaseform = z.infer<typeof probunoInventoryCaseformSchema>;

const CaseSchema = z.object({
  client_name: z.string(),
  sex: z.enum(["male", "female"]),
  date_case_taken: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format for date_case_taken",
  }),
  nature_of_service: z.string(),
  offering_charge: z.string(),
  suit_number: z.string(),
  status_of_case: z.string(),
  last_date_of_appearance: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format for last_date_of_appearance",
  }),
  is_client_in_custody: z.boolean(),
});

export const caseUpdateSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  cases: z.array(CaseSchema),
});


export type TProbunoCaseUpdatePayload = z.infer<typeof caseUpdateSchema>;



const createSchema = (fields: Record<string, any>) => ({
  parse: (data: any) => {
    const errors: Record<string, string> = {};

    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const value = data[key];

      if (field.required && (!value || value.trim() === '')) {
        errors[key] = `${key} is required`;
      }

      if (field.minLength && value && value.length < field.minLength) {
        errors[key] = `${key} must be at least ${field.minLength} characters`;
      }

      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        errors[key] = 'Invalid email format';
      }

      if (field.type === 'number' && value && isNaN(Number(value))) {
        errors[key] = 'Must be a valid number';
      }
    });

    if (Object.keys(errors).length > 0) {
      throw { errors };
    }

    return data;
  }
});


export const personalInfoSchema = z.object({
  state_id: z.string().min(1, { message: 'State filling from is not selected' }).optional(),
  case_type: z.string().min(1, { message: 'Case Type is required' }).optional(),
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  permanent_address: z.string().min(10, { message: 'Address must be at least 10 characters' }),
  age: z.coerce.number({ invalid_type_error: 'Age must be a number' }),
  phone_number: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  marital_status: z.string().min(1, { message: 'Marital status is required' }),
  state_of_origin: z.string().min(1, { message: 'State of origin is required' }),
  occupation: z.string().min(1, { message: 'Occupation is required' }).optional(),
});
export const caseDetailsSchema = z.object({
  complaint: z.string().min(5, { message: 'Complaint must be at least 5 characters' }),
  average_income: z.string({ invalid_type_error: 'Average income must be a number' }),
  legal_aid_reason: z.string().min(5, { message: 'Legal aid reason must be at least 5 characters' }),
  number_of_dependants: z.coerce.number({ invalid_type_error: 'Number of dependants must be a number' }),
  registration_number: z.string().min(1, { message: 'Registration number is required' }),
  case_number: z.string().min(1, { message: 'Case number is required' }),
  defendant_name: z.string().min(1, { message: 'Defendant name is required' }),
  defendant_address: z.string().min(1, { message: 'Defendant address is required' }),
  defendant_phone_number: z.string().min(1, { message: 'Defendant phone number is required' }),
});
export const legalAidFormSchema = z.object({
  offence: z.string().min(1, { message: "Offence is required" }),
  client_location: z.string().min(1, { message: "Client location is required" }),
  date_of_admission: z.string().min(1, { message: "Date of admission is required" }),
  average_income: z.string().min(1, { message: "Average income is required" }),
  legal_aid_reason: z.string().min(1, { message: "Reason for legal aid is required" }),
  case_status: z.string().min(1, { message: "Case status is required" }),
  case_number: z.string().optional(),
  bail_status: z.string().optional(),
  court_of_trial: z.string().optional(),
  prosecuting_agency: z.string().min(1, { message: "Prosecuting agency is required" }),
});


















export const pdssCaseSchema = z.object({
  offence: z.string().min(1, { message: "Offence is required" }),
  client_location: z.string().min(1, { message: "Client location is required" }),

  days_in_detention: z.coerce.number({ invalid_type_error: "Days in detention must be a number" }).nonnegative({ message: "Days in detention cannot be negative" }),

  counsel_paralegal: z.string().min(1, { message: "Counsel/Paralegal is required" }),
  counsel_designation: z.string().min(1, { message: "Counsel designation is required" }),
  name_of_counsel_or_firm_or_organisation_id: z
    .string()
    .min(1, { message: "Name of Counsel/Firm/Organisation ID is required" }),
  nature_of_legal_service_provided: z.string().optional(),
  case_status: z.string().optional(),
  bail_status: z.string().optional(),
  date_trial_ended: z.string().optional(),
  case_outcome: z.string().optional()
});



export type PdssCaseSchema = z.infer<typeof pdssCaseSchema>;

export const PublicCivilCaseSchema = z.object({
  ...personalInfoSchema.shape,
  ...caseDetailsSchema.shape
})
export const PublicCriminalCaseSchema = z.object({
  ...personalInfoSchema.shape,
  ...legalAidFormSchema.shape
})
export const PDSSCaseFullSchema = z.object({
  ...personalInfoSchema.shape,
  ...pdssCaseSchema.shape
})



export type ReviewProbuno = {
  decision: string;
}
export type FormDataCivilCase = {

  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  permanent_address: string;
  age: number;
  phone_number: string;
  marital_status: string;
  email: string;
  state_of_origin: string;
  occupation: string;
  disability_proof: File | null;
  disability_status: string;


  complaint: string;
  offence: string;
  average_income: string;
  number_of_dependants: string;
  registration_number: string;
  case_number: string;
  court_of_hearing: string;
  defendant_name: string;
  client_location: string;
  court_location: string;
  date_of_admission: string;
  legal_aid_reason: string;
  court_of_trial?: string;
  prosecuting_agency?: string;
  defendant_address?: string;
  defendant_phone_number?: string;
  date_in_detention?: string;

  counsel_paralegal?: string;
  general_designation?: string;
  counsel_office_organization?: string;
  case_status?: string;
  bail_status?: string;
  date_next_court?: string;
  legal_service_provided?: string;
  case_outcome?: ''
};

export type FormDataPDSSCase = {

  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  permanent_address: string;
  age: number;
  phone_number: string;
  marital_status: string;
  email: string;
  state_of_origin: string;
  occupation: string;
  disability_proof: File | null;
  disability_status: string;


  offence: string;
  client_location: string;
  days_in_detention: number;
  counsel_paralegal: string;
  counsel_designation: string;
  name_of_counsel_or_firm_or_organisation_id: string;
  nature_of_legal_service_provided?: string;
  case_status?: string;
  bail_status?: string;
  date_trial_ended?: string;
  case_outcome?: string;
};


export interface FormDataDEcongestionCase {

  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  age: number;
  last_address: string;
  marital_status: string;
  have_a_lawyer: string;
  need_legal_aid: string;
  custodial_visit: string;
  date_of_visit: string;


  case_name: string;
  name_of_defendant: string;
  offence_charged_description: string;
  offence_charged: string;
  charge_number: string;
  court_of_trial: string;
  arrest_date: string;
  arraignment_date: string;
  remand_date: string;
  last_court_date: string;
  next_adjournment: string;
  bail_status: string;
  sex: string;
  date_of_birth_age: string;
  name_of_relative: string;
  relative_phone_number: string;
  state_of_origin: string;
  religion: string;
  average_monthly_income: string;
  stage_of_case: string;
  need_interpreter: string;
  disability_ailment: string;
  confessional_statement: string;
}

// export interface FormDataMercyCase {

//   first_name: string;
//   middle_name?: string;
//   last_name: string;
//   gender: string;
//   age: number | string;
//   correctional_facility: string;


//   case_type?: string;
//   offence: string;


//   sentence_passed?: string;
//   date_of_sentence?: string;
//   confessional_statement?: string;
//   reason_for_clemency?: string;
//   health_condition?: string;
//   recommendations?: File | string | null;


//   state_id?: string;
//   id?: string;
//   created_at?: string;
// }




export const personalDecongestionInfoSchema = z.object({
  first_name: z.string(),
  middle_name: z.string(),
  last_name: z.string(),
  gender: z.string(),
  age: z.coerce.number(),
  last_address: z.string(),
  marital_status: z.string(),
  have_a_lawyer: z.string(),
  need_legal_aid: z.string(),
  custodial_visit: z.string(),
  date_of_visit: z.string(),
});


export const decongestionCaseDetails = z.object({
  case_name: z.string(),
  case_type: z.string().optional(),
  state_id: z.string().optional(),
  name_of_defendant: z.string(),
  offence_charged_description: z.string(),
  offence_charged: z.string(),
  charge_number: z.string(),
  court_of_trial: z.string(),
  arrest_date: z.string(),
  arraignment_date: z.string(),
  remand_date: z.string(),
  last_court_date: z.string(),
  next_adjournment: z.string(),
  bail_status: z.string(),
  sex: z.string(),
  date_of_birth_age: z.string(),
  name_of_relative: z.string(),
  relative_phone_number: z.string(),
  state_of_origin: z.string(),
  religion: z.string(),
  average_monthly_income: z.string(),
  stage_of_case: z.string(),
  need_interpreter: z.string(),
  disability_ailment: z.string(),
  confessional_statement: z.string(),
});


export const DecongestionCaseFullSchema = personalDecongestionInfoSchema.merge(decongestionCaseDetails);



// Alternative: If you prefer to keep the interface separate, you can do this:
export interface FormDataMercyCase {
  id?: string;
  state_id?: string;
  created_at?: string;
  correctional_facility: string;
  case_type?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: string;
  age: number;
  offence: string;
  perogative_of_mercy: {
    sentence_passed?: string;
    date_of_sentence?: string;
    perogative_of_mercy?: number;
    reason_for_clemency?: string;
    health_condition?: string;
    recommendations?: string;
  };
}

// And create a matching Zod schema
export const MercyApplicationCaseFullSchema = z.object({
  state_id: z.string().optional(),
  correctional_facility: z.string().min(1, "Correctional facility is required"),
  case_type: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
  age: z.coerce.number().min(1, "Age must be greater than 0"),
  offence: z.string().min(1, "Offense description is required"),
  perogative_of_mercy: z.object({
    sentence_passed: z.string().optional(),
    date_of_sentence: z.string().optional(),
    perogative_of_mercy: z.coerce.number().optional(),
    reason_for_clemency: z.string().optional(),
    health_condition: z.string().optional(),
    recommendations: z.string().optional(),
  })
}) satisfies z.ZodType<FormDataMercyCase>;





export const caseSchema = z.object({
  client_name: z.string(),
  sex: z.enum(["male", "female"]),
  date_case_taken: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  nature_of_service: z.string(),
  offering_charge: z.string(),
  suit_number: z.string(),
  status_of_case: z.string(),

  last_date_of_appearance: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  is_client_in_custody: z.coerce.boolean(),
});

export const probunoUpdateForm = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),



  phone_number: z.string(),
  cases: z.array(caseSchema),
});



