
CREATE TABLE public.chambers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  map_url TEXT,
  available_days INT[] NOT NULL DEFAULT '{}',
  start_hour INT NOT NULL,
  end_hour INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.chambers TO anon, authenticated;
GRANT ALL ON public.chambers TO service_role;
ALTER TABLE public.chambers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chambers are publicly readable" ON public.chambers FOR SELECT USING (true);

CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code TEXT NOT NULL UNIQUE DEFAULT ('TD-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  chamber_id UUID NOT NULL REFERENCES public.chambers(id),
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  patient_age INT,
  service TEXT,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (chamber_id, appointment_date, time_slot)
);
GRANT SELECT, INSERT ON public.appointments TO anon, authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create an appointment" ON public.appointments FOR INSERT WITH CHECK (true);
-- Allow reading only booked slots (date + slot) so the UI can mark them unavailable, but never expose patient PII to the public.
-- We'll expose a view instead:
CREATE VIEW public.booked_slots WITH (security_invoker=on) AS
  SELECT chamber_id, appointment_date, time_slot FROM public.appointments WHERE status <> 'cancelled';
GRANT SELECT ON public.booked_slots TO anon, authenticated;

-- Seed chambers (1=Mon ... 0=Sun; Postgres dow: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6)
INSERT INTO public.chambers (slug, name, address, phone, map_url, available_days, start_hour, end_hour) VALUES
('pavel-dental', 'Pavel Dental Clinic',
 'Haji Monsur Bhaban (2nd Floor), Near Akbar Mayor''s House, Bazar Road Connection, Abdullahpur Bus Stand, South Keraniganj, Dhaka',
 '01700-589394',
 'https://maps.app.goo.gl/oFtyfXpAVWf1FxSE9',
 ARRAY[6,3], 16, 19),
('techno-dental', 'Techno Dental Center',
 '767 Rokeya Sarani (2nd Floor), Near Metro Rail Pillar No. 305, Shewrapara, Mirpur, Dhaka-1216',
 '01911-102968',
 'https://maps.app.goo.gl/fRUFa1xfumt1EdV99',
 ARRAY[0,2,4], 18, 21);
