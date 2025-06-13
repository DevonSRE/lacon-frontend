import { z } from 'zod';

export const proBonoSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  // principal_name: z.string().min(1),
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


// Zod-like validation (simplified implementation)
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

// Define the validation schema for the legal case form
// export const pdsslegalCaseFormSchema = z.object({
//   offence: z.string().min(1, "Offence is required").max(200, "Offence must be less than 200 characters"),
//   client_location: z.string().min(1, "Client location is required").max(100, "Client location must be less than 100 characters"),
//   case_classification: z.string().min(1, "Case classification is required").max(100, "Case classification must be less than 100 characters"),
//   counsel_designation: z.string().min(1, "Counsel designation is required").max(100, "Counsel designation must be less than 100 characters"),
//   court_stage: z.string().min(1, "Court/Stage is required").max(100, "Court/Stage must be less than 100 characters"),
//   name_of_counsel_or_legal_officer: z.string().min(1, "Name of Counsel/Paralegal Officer or Firm, Organization ID is required").max(150, "Name must be less than 150 characters"),
//   nature_of_legal_service_provided: z.string().max(500, "Nature of legal service must be less than 500 characters").optional().or(z.literal("")),
//   case_status: z.string().max(100, "Case status must be less than 100 characters").optional().or(z.literal("")),
//   brief_status: z.string().max(100, "Brief status must be less than 100 characters").optional().or(z.literal("")),
//   date_first_engaged: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional().or(z.literal("")),
//   case_outcome: z.string().max(200, "Case outcome must be less than 200 characters").optional().or(z.literal(""))
// });

// export type LegalCaseFormData = z.infer<typeof pdsslegalCaseFormSchema>;

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
  date_trial_ended: z.string().optional(), // can be changed to z.date() if using date objects
  case_outcome: z.string().optional()
});


// Type inference for TypeScript
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
  // Personal Info
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

  // Case Details
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
  // Personal Info
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

  // Case Details
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




export type FormDataDEcongestionCase = {

  // Personal Info
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

  // Case Details
  case_name: string;
  name_of_defendant: string;
  offence_charged: string;
  charge_number: number;
  court_of_trial: string;
  date_of_arrest_or_complaint: string; // ISO date string
  date_of_arraignment_or_commencement: string; // ISO date string
  date_of_remand?: string; // ISO date string
  last_date_in_court?: string; // ISO date string
  next_adjournment: string; // ISO date string
  bail_status: string;

  // Defendant Info
  sex: string;
  date_of_birth_or_age: string;
  name_of_relative: string;
  relative_phone_number: string;

  // Original fields preserved if still applicable
  offence: string;
  arrest_date: string;
  arraignment_date: string;
  remand_date: string;
  last_court_date: string;
  client_location: string;
  days_in_detention: number;
  counsel_paralegal: string;
  counsel_designation: string;
  name_of_counsel_or_firm_or_organisation_id: string;
  nature_of_legal_service_provided?: string;
  case_status?: string;
  date_trial_ended?: string;
  case_outcome?: string;
};






// probonoUpdate

export const caseSchema = z.object({
  client_name: z.string(),
  sex: z.enum(["male", "female"]),
  date_case_taken: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  nature_of_service: z.string(),
  offering_charge: z.string(),
  suit_number: z.string(),
  status_of_case: z.string(),
  // status_of_case: z.enum(["Ongoing", "Concluded"]),
  last_date_of_appearance: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  is_client_in_custody: z.coerce.boolean(),
});

export const probunoUpdateForm = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  // phone_number: z
  //   .string()
  //   .regex(/^\+234\d{10}$/, "Invalid Nigerian phone number. Must start with +234 and have 13 digits total."),
  phone_number: z.string(),
  cases: z.array(caseSchema),
});



