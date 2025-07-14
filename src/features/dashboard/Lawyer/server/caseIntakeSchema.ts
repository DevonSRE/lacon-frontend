// src/features/dashboard/Lawyer/server/caseIntakeSchema.ts

import { z } from "zod";

export const caseIntakeSchema = z.object({
  lawyer_name: z.string().min(1, "Lawyer name is required"),
  principal_name: z.string().min(1, "Principal name is required"),
  number_of_lawyers: z.coerce.number().min(1, "Number of lawyers is required"),
  pro_bono_cases: z.coerce.number().min(1, "Pro bono cases is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number is too short"),
  alternate_number: z.string().optional(),

  nba_member_ship: z.string().min(1, "NBA membership is required"),
  law_firm_organization_address: z.string().min(1, "Address is required"),
  year_of_call: z.string().min(1, "Year of call is required"),
  experience: z.string().min(1, "Experience is required"),
  criminal_matter_preference: z.string().min(1, "Criminal matter preference is required"),
  // criminal_matter_preference: z.array(
  //   z.enum([
  //     'Appellate Courts',
  //     'High Courts',
  //     'Magistrate Courts',
  //     'Customary Court',
  //     'Sharia Court',
  //     'Area Court',
  //   ])
  // ),
});

export type CaseIntakeType = z.infer<typeof caseIntakeSchema>;
