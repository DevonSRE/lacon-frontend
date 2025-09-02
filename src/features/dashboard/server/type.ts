import { UserType, Zone } from "@/lib/types";
import { z } from "zod";

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
export const createUserSchema = z
  .object({
    user_type: z.string().min(1, "User type is required"),
    designation: z.string().optional(),
    state_id: z.string().optional(),
    zone_id: z.string().optional(),
    center_id: z.string().optional(),
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
    if (
      (data.user_type === "LacON Lawyer" || data.user_type === "Paralegal") &&
      !data.designation
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Designation is required for this user type",
        path: ["designation"],
      });
    }

    // Conditional validation for state
    const needsState =
      data.user_type === "State Coordinator" ||
      data.user_type === "Centre Coordinator" ||
      data.designation === "State Lawyer" ||
      data.designation === "State Office";
    if (needsState && !data.state_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "State selection is required",
        path: ["state"],
      });
    }

    // Conditional validation for zone
    const needsZone =
      data.user_type === "Zonal Director" ||
      data.designation === "Centre Lawyer" ||
      data.designation === "Zonal Office";
    if (needsZone && !data.zone_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Zone selection is required",
        path: ["zone"],
      });
    }
  });
export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const createLawyerSchema = z.object({
  id: z.string().optional(),
  user_type: z.string().min(1, "User type is required"),
  state_id: z.string().optional(),
  zone_id: z.string().optional(),
  center_id: z.string().optional(),

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
