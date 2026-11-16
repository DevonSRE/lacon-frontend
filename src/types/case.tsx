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
  // How this pro bono lawyer's latest application was decided (APPROVED or
  // DECLINED). Absent for everyone else, and for a decision never made.
  probono_decision?: string;
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
  state?: string;
  state_id?: string;
  zone_id?: string;
  zone_name?: string;
  center_name?: string | null;
  center_id?: string;
  max_case_load?: string;
  // What the API actually sends, as a number on the lawyer endpoints and a
  // string on the ones that echo a form back. The page read max_case_load,
  // which no response carries, so every lawyer's limit showed as "-"
  // (QA 2026-11-01 run 4, 13 Nov, row 40).
  max_load?: string | number;
  created_at?: string;
  updated_at?: string;
}




export interface ILawyerRequest {
  // Not sent by the API yet; see lacon-shared/backend-issues.
  RequestedByRole?: string;
  ID: string;
  ApplicationID?: string;
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
  // The account an ADD request asks for; the list endpoint returns the model,
  // so these come back PascalCase.
  ProposedUserType?: string;
  ProposedPhone?: string;
  LawyerEmail?: string;
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
  // Pro bono applications: what the public form asked, and the decision once made.
  LawFirmName?: string;
  LawFirmAddress?: string;
  StateBarMembership?: string;
  MostContactableNumber?: string;
  StateOfPractice?: string;
  // Which form the application came in on: NEW_APPLICATION, EXISTING_CASES
  // (the Inventory form) or DIRECT_ONBOARDING.
  RegistrationSource?: string;
  PrincipalName?: string;
  LawyersCountInFirm?: number;
  AreasCovered?: string;
  ClientBase?: string;
  SourceOfClients?: string;
  // The cases the lawyer declared on the application. The reviewer was
  // deciding without them (QA 2026-11-01 run 4, 13 Nov, row 36).
  DeclaredCases?: IProbonoDeclaredCase[];
  DecidedBy?: { name: string; role: string } | null;
  DecidedAt?: string | null;
}

export interface IProbonoDeclaredCase {
  id: string;
  client_name?: string;
  sex?: string;
  date_case_taken?: string | null;
  nature_of_service?: string;
  offering_charge?: string;
  suit_number?: string;
  status_of_case?: string;
  last_date_of_appearance?: string;
  is_client_in_custody?: boolean;
  submitted_at?: string | null;
}



export interface ILawyerManagement {
  // How this pro bono lawyer's latest application was decided (APPROVED or
  // DECLINED). Absent for everyone else, and for a decision never made.
  probono_decision?: string;
  // Cases the lawyer is working on now, counted live from the cases.
  open_cases?: number;
  // Work the lawyer finished: cases they were assigned that reached Completed
  // or Closed (T9). A referred or transferred case left LACON's hands rather
  // than being finished, so it is not counted here.
  completed_cases?: number;
  // A change the Director General has not decided yet: DEACTIVATE or REACTIVATE.
  pending_change?: string;
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  name?: string;
  email: string;
  phone_number: string;
  max_case_load: string;
  max_load?: string | number;
  gender?: string;
  date_of_birth?: string;
  user_type: string;
  status: string;
  state: string;
  state_id: string;
  zone_id: string;
  zone_name: string;
  center_name?: string | null;
  center_id?: string;
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
    criminal_case?: Record<string, unknown>;
    civil_case?: Record<string, unknown>;
    pdss?: Record<string, unknown>;
}
