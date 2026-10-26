import { Zone } from "@/lib/types";
import { z } from "zod";
import { invitationScope } from "@/lib/user-invitation-options";

export interface FormDataUser {
  user_type: string;
  designation: string;
  state_id: string;
  zone_id: string;
  center_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}
export interface FormDataLawyer {
  user_type: string;
  designation: string;
  state: string;
  zone: string;
  first_name: string;
  last_name: string;
  zone_id: string;
  center_id: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
  department_name: string;
  max_load: string;
  reason: string;
}

export const zones: Zone[] = [
  "North West",
  "North East",
  "North Central",
  "South West",
  "South East",
  "South South",
];

// Zod Schema for form validation
const optionalLocationId = z.preprocess(value => value === "" ? undefined : value, z.uuid("Choose a valid location").optional());

export const createUserSchema = z
  .object({
    user_type: z.string().min(1, "User type is required"),
    designation: z.string().optional(),
    state_id: optionalLocationId,
    zone_id: optionalLocationId,
    center_id: optionalLocationId,
    role: z.string().optional(),
    status: z.string().optional(),
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name is too long"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone_number: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[\+]?[\d\s\-\(\)]{10,}$/, "Please enter a valid phone number"),
  })
  .superRefine((data, ctx) => {
    const scope = invitationScope(data.user_type, data.designation);
    if (scope.designation && !data.designation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Designation is required for this user type",
        path: ["designation"],
      });
    }

    // Conditional validation for state
    if (scope.state && !data.state_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "State selection is required",
        path: ["state_id"],
      });
    }

    // Conditional validation for zone
    if (scope.zone && !data.zone_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Zone selection is required",
        path: ["zone_id"],
      });
    }
    if (scope.center && !data.center_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Centre selection is required", path: ["center_id"] });
    }
  });
export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const createLawyerSchema = z.object({
  id: z.string().optional(),
  user_type: z.string().min(1, "User type is required"),
  state_id: z.string().optional(),
  zone_id: z.string().optional(),
  center_id: z.string().optional(),
  // department_name links the lawyer to a department or unit, so its head can
  // assign cases to them; max_load is how many cases they take at once. Both
  // are dropped by the schema unless listed here.
  department_name: z.string().optional(),
  max_load: z.string().optional(),
  // A field office raises a request instead of creating the account; the reason
  // is what the Director General decides on.
  as_request: z.string().optional(),
  reason: z.string().optional(),

  // status: z.string().optional(),
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\+]?[\d\s\-\(\)]{10,}$/, "Please enter a valid phone number"),
});

export type CreateLawFormData = z.infer<typeof createLawyerSchema>;
