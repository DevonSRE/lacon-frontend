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