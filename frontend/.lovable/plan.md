## V4 — Platform Foundation Plan

Transform Techno Dental from a marketing site into a clinic-management platform. The public site stays untouched.

---

### 1. Database (Supabase migration)

New enum + tables. RLS enabled on every table with explicit GRANTs.

```text
app_role             enum('patient','doctor','admin')
appointment_status   enum('pending','confirmed','completed','cancelled','no_show','follow_up')

profiles             id(uuid=auth.users.id) full_name phone email dob gender created_at updated_at
user_roles           id user_id role  (unique user_id+role)
doctors              id(uuid=auth.users.id) display_name specialty bio photo_url
patients             id(uuid=auth.users.id) medical_notes
prescriptions        id patient_id doctor_id appointment_id notes status created_at  (placeholder)
treatment_history    id patient_id doctor_id title description treated_at
invoices             id patient_id appointment_id amount status created_at           (placeholder)
appointment_status_logs id appointment_id from_status to_status changed_by note created_at
```

Existing `appointments` table gets two added columns:
- `patient_user_id uuid` → `auth.users(id)` nullable (set when a logged-in patient books)
- `doctor_user_id uuid` → `auth.users(id)` nullable (admin-assignable)
- `status` column migrates from text to the new enum, preserving values

A `handle_new_user()` trigger on `auth.users` creates a `profiles` row + assigns the default `patient` role.

A SECURITY DEFINER `has_role(uid, role)` function powers all RLS checks (no recursion).

### 2. RLS Policies (summary)

- **profiles**: user sees/edits own; admin sees/edits all; doctors see profiles of patients they have appointments with.
- **user_roles**: user reads own; only admin writes.
- **patients/doctors**: similar self + admin pattern; doctors viewable by all authenticated.
- **appointments**: patient sees rows where `patient_user_id = auth.uid()`; doctor sees rows where `doctor_user_id = auth.uid()`; admin all. Insert remains public (preserves anonymous booking).
- **prescriptions / treatment_history / invoices**: patient sees own; assigned doctor sees; admin all.
- **appointment_status_logs**: doctor/admin write; patient reads for own appointments.

### 3. Auth & Routing

- Use existing Supabase client + the integration-managed `_authenticated/route.tsx` gate.
- New routes:
  - `/auth` — login + register tabs (email/password + Google), forgot-password link
  - `/auth/reset-password` — public, handles recovery type
  - `/_authenticated/dashboard` — role-based redirect to patient/doctor/admin home
  - `/_authenticated/patient/{index,appointments,prescriptions,history,profile}`
  - `/_authenticated/doctor/{index,appointments,patients,prescriptions,reports}`
  - `/_authenticated/admin/{index,users,appointments,website,settings}`
- Role gate via small pathless layouts that read role from `user_roles` and redirect if mismatched.
- Replace existing placeholder `/account` routes — point old `/account` to `/dashboard`.

### 4. Navbar Account Menu

Replace current "Account" button with a dropdown that reflects auth state + role (Not logged in / Patient / Doctor / Admin menus per spec). Mobile drawer mirrors it.

### 5. Booking Flow Update

Current `BookingFlow.tsx` becomes 6-step:
1. Chamber → 2. Date → 3. Slot → 4. Info → **5. Login or Create Account (skipped if already authed)** → 6. Confirm.

On confirm, insert appointment with `patient_user_id = auth.uid()`. Anonymous browsing/slot viewing remains unchanged.

### 6. Dashboards (functional + placeholders)

- **Patient**: real upcoming/past appointments from DB; cancel = status→cancelled (with status log); prescriptions/treatment list = empty-state placeholders; profile edits `profiles`.
- **Doctor**: today/upcoming queue from `appointments` filtered by `doctor_user_id`; mark completed/follow-up writes status + log; patient search via assigned-patients view; prescriptions = placeholder; simple count metrics.
- **Admin**: counts (patients, appointments, upcoming) via server fn using `supabaseAdmin`; users table CRUD (activate/deactivate via `banned_until`); appointment management (assign doctor, change status); website-management/settings = scaffolded shells.

### 7. Server Functions

All sensitive reads go through `createServerFn` with `requireSupabaseAuth`. Admin-only fns gate on `has_role(uid,'admin')`. Files: `src/lib/dashboard.functions.ts`, `src/lib/admin.functions.ts`, `src/lib/profile.functions.ts`.

### 8. Design

Reuse existing tokens (`bg-background`, `glass`, `bg-gradient-brand`, `shadow-soft`). Dashboard layout: left sidebar (shadcn `Sidebar`) + topbar with account menu, white cards, soft blue accents — consistent with current site. No generic admin template look.

### 9. Out of Scope (deferred)

Prescription PDF/QR, billing/invoice generation logic, Bangla i18n, WhatsApp/SMS — schema present, UI placeholders only.

---

### Delivery order
1. Migration (DB + RLS + trigger)
2. Auth pages + navbar dropdown
3. `_authenticated` role gates + dashboard shells
4. Booking flow update (step 5 inserted)
5. Patient dashboard (real data)
6. Doctor dashboard (real data)
7. Admin dashboard (real data)
8. Polish + verify build

This is a large phase (~25–35 files). I'll execute it in the order above once you approve.
