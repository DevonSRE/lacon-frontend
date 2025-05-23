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
  name: string;
  email: string;
  role: string;
  status: string;
}