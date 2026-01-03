export type Tanker = {
  id: number;
  comp_id: number;
  branch_id: number;
  tanker_type: string;
  capacity: number;
  tanker_quantity: string;
  tanker_price: string;
  created_at: string;
};

export type Company = {
  id: string;
  city_id: string;
  company_logo: string | null;
  company_name: string;
  established_date: string;
  company_type: string;
  company_city: string;
  company_location: string;
  contact_no: string;
  company_email: string;
  head_office: string;
  user_name: string;
  latitude: string;
  longitude: string;
  company_status: string;
  company_created_at: string;
  tankers: Tanker[];
};
