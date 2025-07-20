// types/ProfileData.ts

export interface ProfileData {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  avatar_url?: string;
  ratings: string[];
  license?: string;
  role: "admin" | "pilot" | "staff" | "organisation";
  status: "active" | "pending" | "suspended";
  updated_at: string;
  created_at: string;
  presaved: string[];
  quick_nav?:string[];
  aircraft: string[];
  public: string; 
}

export type UserAircraft = {
  id: string;
  mtow: number;
};

export type UserPNProfile = {
  id: string;
  aircraft: UserAircraft[];
  presaved: {
    PIC: string[];
  };
};

export type ProfileOption = {
  id: string;
  label: string;
};