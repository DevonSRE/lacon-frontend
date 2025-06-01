import { z } from 'zod';

export const proBonoSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  principal_name: z.string().min(1),
  lawyers_count_in_firm: z.number().min(1),
  law_firm_address: z.string().min(1),
  email: z.string().email(),
  state_id: z.string().uuid(),
  phone_number: z.string(),
  alternate_number: z.string(),
  year_of_call: z.string().min(4).max(4),
  nba_branch: z.string().min(1),
  experience_in_criminal_law: z.enum(['Below 2 years', '2-5 years', '5-10 years', 'Above 10 years']),
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
  areas_covered: z.string().min(1),
  client_base: z.string().min(1),
  source_of_clients: z.string().min(1),
});

export type TProbunoFormPayload = z.infer<typeof proBonoSchema>;


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

// Schema definitions
export const personalInfoSchema = createSchema({
  firstName: { required: true, minLength: 2 },
  lastName: { required: true, minLength: 2 },
  gender: { required: true },
  permanentAddress: { required: true, minLength: 10 },
  age: { required: true, type: 'number' },
  phoneNumber: { required: true, minLength: 10 },
  maritalStatus: { required: true },
  stateOfOrigin: { required: true },
  occupation: { required: true }
});

export const caseDetailsSchema = createSchema({
  complaint: { required: true, minLength: 50 },
  averageIncome: { required: true, type: 'number' },
  reasonsForLegalAid: { required: true, minLength: 20 },
  numberOfDependants: { required: true, type: 'number' },
  registrationNumber: { required: true },
  caseNo: { required: true },
  defendantName: { required: true },
  defendantAddress: { required: true },
  defendantPhone: { required: true }
});

export type FormDataCivilCase = {
  // Personal Info
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  permanentAddress: string;
  age: string;
  phoneNumber: string;
  maritalStatus: string;
  emailAddress: string;
  stateOfOrigin: string;
  occupation: string;
  disabilityProof: File | null;
  disabilityDescription: string;

  // Case Details
  complaint: string;
  averageIncome: string;
  reasonsForLegalAid: string;
  numberOfDependants: string;
  registrationNumber: string;
  caseNo: string;
  courtOfHearing: string;
  defendantName: string;
  defendantAddress: string;
  defendantPhone: string;
};
