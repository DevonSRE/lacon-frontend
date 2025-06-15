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
  avatar : string;
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
  LawyerID: string;
  LawyerName: string;
  Reason: string;
  Action : string;
  first_name: string;
  Status: string;
  LawyerEmail: string;
  Experience: string;
  MaxLoad: string;
  Speciaty: string;
  RequestedByID: string;
  RequestedName: string;
  status: string;
  CreatedAt: string;
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
