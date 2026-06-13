import { api } from "@/lib/api";

export type Chamber = {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  map_url: string | null;
  available_days: number[];
  start_hour: number;
  end_hour: number;
};

export type BookingPayload = {
  chamberId: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  service?: string;
  notes?: string;
};

export type BookingResult = {
  id: string;
  booking_code: string;
  appointment_date: string;
  time_slot: string;
  status: string;
};

export async function listChambers(): Promise<Chamber[]> {
  return api.get<Chamber[]>("/api/chambers");
}

export async function listBookedSlots({
  chamberId,
  date,
}: {
  chamberId: string;
  date: string;
}): Promise<string[]> {
  return api.get<string[]>(
    `/api/appointments/booked-slots?chamberId=${encodeURIComponent(chamberId)}&date=${encodeURIComponent(date)}`,
  );
}

export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  return api.post<BookingResult>("/api/appointments", {
    chamberId: payload.chamberId,
    date: payload.date,
    timeSlot: payload.timeSlot,
    patientName: payload.patientName,
    patientPhone: payload.patientPhone,
    patientEmail: payload.patientEmail,
    patientAge: payload.patientAge,
    service: payload.service,
    notes: payload.notes,
  });
}
