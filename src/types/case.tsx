export interface ICaseAssignment {
  id: string;
  site_id: string;
  fleet_number: string;
  description: string;
  created_at: string;
  created_by: string;
  status?: string;
}
export interface IUser {
  id: string;
  user_id: string;
  user_type: string;
  avatar: string;
  first_name: string;
  profile_image: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
}




export interface ILawyerRequest {
  ID: string;
  LawyerID:string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  LawyerName: string;
  RequestedName: string;
  PhoneNumber: string;
  Email: string;
  Gender: string;
  DateOfBirth: string;
  UserType: string;
  Status: string;
  DGStatus: string;
  DepartmentName: string;
  Action: string;
  Otp: number;
  IsOtpVerify: boolean;
  OtpExpiresAt: string;
  ZoneID: string;
  ZoneName: string;
  StateID: string;
  CenterID: string | null;
  StateName: string;
  CenterName: string | null;
  MaxLoad: number;
  CaseAssignmentCount: number;
  CompletedCasesCount: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  UpdatedBy: string;
  ProfileImage: string;
  DecisionReason: string;
  NBANumber: string;
  YearOfCall: string;
  AltNumber: string;
  Experience: string;
  Reason: string;
  PreferredCourt: string;
  Speciaty: string;
}



export interface ILawyerManagement {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  name?: string;
  email: string;
  phone_number: string;
  max_case_load: string;
  gender?: string;
  date_of_birth?: string;
  user_type: string;
  status: string;
  state: string;
  state_id: string;
  zone_id: string;
  zone_name: string;
  center_name?: string | null;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}



export interface CaseOverview {
    id: string;
    case_type: string;
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
    disability_status: string;
    status: string;
    criminal_case?: any;
    civil_case?: any;
    pdss?: any;
}