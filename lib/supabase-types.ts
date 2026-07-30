export type UserRole = "client" | "driver" | "admin";

export interface AppUser {
  id: string;
  email: string;
  phone?: string | null;
  full_name?: string | null;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface Ride {
  id: string;
  rider_id: string;
  driver_id?: string | null;
  status: "requested" | "accepted" | "in_progress" | "completed" | "cancelled";
  pickup_address?: string | null;
  dropoff_address?: string | null;
  distance_km?: number | null;
  price_cfa?: number | null;
  created_at?: string;
}
