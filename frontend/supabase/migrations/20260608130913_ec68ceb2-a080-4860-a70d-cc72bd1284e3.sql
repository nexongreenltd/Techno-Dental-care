
-- ============== ENUMS ==============
do $$ begin
  create type public.app_role as enum ('patient','doctor','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.appointment_status as enum ('pending','confirmed','completed','cancelled','no_show','follow_up');
exception when duplicate_object then null; end $$;

-- ============== updated_at trigger fn ==============
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- ============== PROFILES ==============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  dob date,
  gender text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- ============== USER_ROLES ==============
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- ============== PATIENTS ==============
create table if not exists public.patients (
  id uuid primary key references auth.users(id) on delete cascade,
  medical_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.patients to authenticated;
grant all on public.patients to service_role;
alter table public.patients enable row level security;

-- ============== DOCTORS ==============
create table if not exists public.doctors (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  specialty text,
  bio text,
  photo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.doctors to anon, authenticated;
grant insert, update on public.doctors to authenticated;
grant all on public.doctors to service_role;
alter table public.doctors enable row level security;

-- ============== APPOINTMENTS — extend ==============
alter table public.appointments
  add column if not exists patient_user_id uuid references auth.users(id) on delete set null,
  add column if not exists doctor_user_id  uuid references auth.users(id) on delete set null;

create index if not exists appointments_patient_user_id_idx on public.appointments(patient_user_id);
create index if not exists appointments_doctor_user_id_idx  on public.appointments(doctor_user_id);

-- Add new RLS reads (existing INSERT-anyone policy stays)
grant select, update on public.appointments to authenticated;

-- Drop pre-existing select policies (if any) before re-creating idempotently
do $$ begin
  perform 1;
end $$;

drop policy if exists "Patients can view their own appointments" on public.appointments;
create policy "Patients can view their own appointments" on public.appointments
  for select to authenticated using (patient_user_id = auth.uid());

drop policy if exists "Doctors can view their appointments" on public.appointments;
create policy "Doctors can view their appointments" on public.appointments
  for select to authenticated using (doctor_user_id = auth.uid());

drop policy if exists "Admins can view all appointments" on public.appointments;
create policy "Admins can view all appointments" on public.appointments
  for select to authenticated using (public.has_role(auth.uid(),'admin'));

drop policy if exists "Doctors can update their appointments" on public.appointments;
create policy "Doctors can update their appointments" on public.appointments
  for update to authenticated using (doctor_user_id = auth.uid()) with check (doctor_user_id = auth.uid());

drop policy if exists "Patients can update their own appointments" on public.appointments;
create policy "Patients can update their own appointments" on public.appointments
  for update to authenticated using (patient_user_id = auth.uid()) with check (patient_user_id = auth.uid());

drop policy if exists "Admins can update appointments" on public.appointments;
create policy "Admins can update appointments" on public.appointments
  for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (true);

-- ============== PRESCRIPTIONS ==============
create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  doctor_id  uuid references auth.users(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  notes text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.prescriptions to authenticated;
grant all on public.prescriptions to service_role;
alter table public.prescriptions enable row level security;

-- ============== TREATMENT HISTORY ==============
create table if not exists public.treatment_history (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  doctor_id  uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  treated_at date not null default current_date,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.treatment_history to authenticated;
grant all on public.treatment_history to service_role;
alter table public.treatment_history enable row level security;

-- ============== INVOICES ==============
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  amount numeric(12,2) not null default 0,
  status text not null default 'unpaid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.invoices to authenticated;
grant all on public.invoices to service_role;
alter table public.invoices enable row level security;

-- ============== APPOINTMENT STATUS LOGS ==============
create table if not exists public.appointment_status_logs (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);
grant select, insert on public.appointment_status_logs to authenticated;
grant all on public.appointment_status_logs to service_role;
alter table public.appointment_status_logs enable row level security;

-- ============== updated_at triggers ==============
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
drop trigger if exists patients_set_updated_at on public.patients;
create trigger patients_set_updated_at before update on public.patients
  for each row execute function public.set_updated_at();
drop trigger if exists doctors_set_updated_at on public.doctors;
create trigger doctors_set_updated_at before update on public.doctors
  for each row execute function public.set_updated_at();
drop trigger if exists prescriptions_set_updated_at on public.prescriptions;
create trigger prescriptions_set_updated_at before update on public.prescriptions
  for each row execute function public.set_updated_at();
drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at before update on public.invoices
  for each row execute function public.set_updated_at();

-- ============== handle_new_user ==============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, auth as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', new.phone, '')
  ) on conflict (id) do nothing;

  insert into public.patients (id) values (new.id) on conflict (id) do nothing;

  insert into public.user_roles (user_id, role) values (new.id, 'patient')
    on conflict (user_id, role) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============== POLICIES ==============
-- profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists "Admins view all profiles" on public.profiles;
create policy "Admins view all profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'admin'));
drop policy if exists "Admins update all profiles" on public.profiles;
create policy "Admins update all profiles" on public.profiles for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (true);
drop policy if exists "Doctors view patient profiles" on public.profiles;
create policy "Doctors view patient profiles" on public.profiles for select to authenticated using (
  public.has_role(auth.uid(),'doctor')
  and exists (select 1 from public.appointments a where a.doctor_user_id = auth.uid() and a.patient_user_id = profiles.id)
);

-- user_roles
drop policy if exists "Users view own roles" on public.user_roles;
create policy "Users view own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
drop policy if exists "Admins view all roles" on public.user_roles;
create policy "Admins view all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));
drop policy if exists "Admins manage roles" on public.user_roles;
create policy "Admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- patients
drop policy if exists "Patients view own" on public.patients;
create policy "Patients view own" on public.patients for select to authenticated using (id = auth.uid());
drop policy if exists "Patients update own" on public.patients;
create policy "Patients update own" on public.patients for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "Patients insert own" on public.patients;
create policy "Patients insert own" on public.patients for insert to authenticated with check (id = auth.uid());
drop policy if exists "Admins manage patients" on public.patients;
create policy "Admins manage patients" on public.patients for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (true);
drop policy if exists "Doctors view their patients" on public.patients;
create policy "Doctors view their patients" on public.patients for select to authenticated using (
  public.has_role(auth.uid(),'doctor')
  and exists (select 1 from public.appointments a where a.doctor_user_id = auth.uid() and a.patient_user_id = patients.id)
);

-- doctors
drop policy if exists "Doctors readable by all" on public.doctors;
create policy "Doctors readable by all" on public.doctors for select to anon, authenticated using (true);
drop policy if exists "Doctors update self" on public.doctors;
create policy "Doctors update self" on public.doctors for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "Admins manage doctors" on public.doctors;
create policy "Admins manage doctors" on public.doctors for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (true);

-- prescriptions
drop policy if exists "Patients view own prescriptions" on public.prescriptions;
create policy "Patients view own prescriptions" on public.prescriptions for select to authenticated using (patient_id = auth.uid());
drop policy if exists "Doctors view their prescriptions" on public.prescriptions;
create policy "Doctors view their prescriptions" on public.prescriptions for select to authenticated using (doctor_id = auth.uid());
drop policy if exists "Doctors write prescriptions" on public.prescriptions;
create policy "Doctors write prescriptions" on public.prescriptions for insert to authenticated with check (doctor_id = auth.uid());
drop policy if exists "Doctors update their prescriptions" on public.prescriptions;
create policy "Doctors update their prescriptions" on public.prescriptions for update to authenticated using (doctor_id = auth.uid()) with check (doctor_id = auth.uid());
drop policy if exists "Admins manage prescriptions" on public.prescriptions;
create policy "Admins manage prescriptions" on public.prescriptions for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (true);

-- treatment_history
drop policy if exists "Patients view own history" on public.treatment_history;
create policy "Patients view own history" on public.treatment_history for select to authenticated using (patient_id = auth.uid());
drop policy if exists "Doctors view their patient history" on public.treatment_history;
create policy "Doctors view their patient history" on public.treatment_history for select to authenticated using (doctor_id = auth.uid());
drop policy if exists "Doctors write history" on public.treatment_history;
create policy "Doctors write history" on public.treatment_history for insert to authenticated with check (doctor_id = auth.uid());
drop policy if exists "Admins manage history" on public.treatment_history;
create policy "Admins manage history" on public.treatment_history for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (true);

-- invoices
drop policy if exists "Patients view own invoices" on public.invoices;
create policy "Patients view own invoices" on public.invoices for select to authenticated using (patient_id = auth.uid());
drop policy if exists "Admins manage invoices" on public.invoices;
create policy "Admins manage invoices" on public.invoices for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (true);

-- appointment_status_logs
drop policy if exists "Patients view own status logs" on public.appointment_status_logs;
create policy "Patients view own status logs" on public.appointment_status_logs for select to authenticated using (
  exists (select 1 from public.appointments a where a.id = appointment_status_logs.appointment_id and a.patient_user_id = auth.uid())
);
drop policy if exists "Doctors view their status logs" on public.appointment_status_logs;
create policy "Doctors view their status logs" on public.appointment_status_logs for select to authenticated using (
  exists (select 1 from public.appointments a where a.id = appointment_status_logs.appointment_id and a.doctor_user_id = auth.uid())
);
drop policy if exists "Staff insert status logs" on public.appointment_status_logs;
create policy "Staff insert status logs" on public.appointment_status_logs for insert to authenticated with check (
  public.has_role(auth.uid(),'admin')
  or exists (select 1 from public.appointments a where a.id = appointment_status_logs.appointment_id and a.doctor_user_id = auth.uid())
);
drop policy if exists "Admins view status logs" on public.appointment_status_logs;
create policy "Admins view status logs" on public.appointment_status_logs for select to authenticated using (public.has_role(auth.uid(),'admin'));
