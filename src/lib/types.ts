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


export type TusersRoles =
  "all" |
  "DIRECTOR_GENERAL" |
  "CRIMINAL_JUSTICE_DEPT" |
  "CIVIL_JUSTICE_DEPT" |
  "DECONGESTION_UNIT_HEAD" |
  "PREROGATIVE_OF_MERCY_UNIT_HEAD" |
  "PARALEGAL" |
  "PRO_BONO_LAWYER" |
  "CENTRE_COORDINATOR" |
  "ZONAL_DIRECTOR" |
  "STATE_COORDINATOR" |
  "OSCAR_UNIT_HEAD" |
  "ADMIN" |
  "LACON_LAWYER" |
  "DIO";



export const ROLES = [
  "DIRECTOR GENERAL",
  "CRIMINAL JUSTICE DEPT. HEAD",
  "CIVIL JUSTICE DEPT. HEAD",
  "DECONGESTION UNIT HEAD",
  "PREROGATIVE OF MERCY UNIT HEAD",
  "OSCAR UNIT HEAD",
  "DIO",
  "PDSS",
  "ZONAL DIRECTOR",
  "STATE COORDINATOR",
  "CENTRE COORDINATOR",
  "LACON LAWYER",
  "PRO BONO LAWYER",
  "PARALEGAL",
] as const;

// 2. Create the union type from the ROLES array
export type UserType = typeof ROLES[number];


export type TUser = Pick< TFullUser, "id" | "first_name" | "last_name" | "email" | "user_type" | "profile_image">;


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



export const stateOptions = states.map(state => ({
  value: state,
  label: state === 'FCT' ? 'Federal Capital Territory' : state
}));




export type TCase = {
  id: string;
  status: string;
  clientName: string;
  caseType: string;
  state: string;
  filedBy: string;
};