export type GENDER = "MALE" | "FEMALE";
export type STATUS = "ACTIVE" | "INACTIVE";
export type ROLE = "PLATFORM_ADMIN" | "ADMIN" | "USER";

/* User schema */

export type TFullUser = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_image: string;
  date_of_birth: string;
  gender: GENDER;
  status: STATUS;
  user_type: ROLE;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};


export type TUser = Pick<
  TFullUser,
  "id" | "first_name" | "last_name" | "email" | "user_type" | "profile_image"
>


export type UserType =
  | 'Civil Justice Department Head'
  | 'Decongestion Unit Head'
  | 'Prerogative Of Mercy Unit Head'
  | 'OSCAR Unit Head'
  | 'Pro bono Lawyer'
  | 'Centre Coordinator'
  | 'Director General'
  | 'Criminal Justice Department Head'
  | 'Paralegal'
  | 'State Coordinator'
  | 'Zonal Director'
  | 'LacON Lawyer'
  | 'Dio';


export type Designation = 'Head Office' | 'State Office' | 'Zonal Office' | 'Centre lawyer' | 'State Lawyer' | 'Head Quarters';

export type Zone = 'North West' | 'North East' | 'North Central' | 'South West' | 'South East' | 'South South';

export const states = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];



export type TCase = {
  id: string;
  status: string;
  clientName: string;
  caseType: string;
  state: string;
  filedBy: string;
};