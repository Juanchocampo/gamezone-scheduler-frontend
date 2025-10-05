import { User } from "../../auth/interfaces/auth.interface";
import { Console } from "./console.interface";

export interface Reservations {
  starts_at:         Date;
  id:                string;
  qr_sig:            string;
  ends_at:           Date;
  confirmed_at:      Date;
  created_at:        Date;
  status_id:         number;
  confirmed_by_user: User;
  user:              User;
  console:           Console;
}