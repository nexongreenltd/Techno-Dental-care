import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth, requireRole, optionalAuth } from "../middleware/auth.js";

const router = Router();

function generateBookingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TDC-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// GET /api/appointments/booked-slots — public
router.get("/booked-slots", async (req, res) => {
  const { chamberId, date } = req.query;
  if (!chamberId || !date) { res.status(400).json({ error: "chamberId and date required" }); return; }
  const { rows } = await pool.query(
    `SELECT time_slot FROM appointments
     WHERE chamber_id = $1 AND appointment_date = $2
     AND status NOT IN ('cancelled')`,
    [chamberId, date],
  );
  res.json(rows.map((r: { time_slot: string }) => r.time_slot));
});

// POST /api/appointments — public (optionally authenticated)
router.post("/", optionalAuth, async (req, res) => {
  const schema = z.object({
    chamberId: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timeSlot: z.string().min(1).max(10),
    patientName: z.string().min(2).max(100),
    patientPhone: z.string().min(6).max(30),
    patientEmail: z.string().email().max(200).optional().or(z.literal("")).optional(),
    patientAge: z.number().int().min(0).max(150).optional(),
    service: z.string().max(120).optional(),
    notes: z.string().max(1000).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const d = parsed.data;

  // Check slot not already taken
  const existing = await pool.query(
    `SELECT id FROM appointments WHERE chamber_id=$1 AND appointment_date=$2 AND time_slot=$3 AND status != 'cancelled'`,
    [d.chamberId, d.date, d.timeSlot],
  );
  if (existing.rows.length > 0) { res.status(409).json({ error: "That time slot was just taken. Please pick another." }); return; }

  // Generate unique booking code
  let bookingCode = generateBookingCode();
  for (let attempts = 0; attempts < 10; attempts++) {
    const check = await pool.query("SELECT id FROM appointments WHERE booking_code = $1", [bookingCode]);
    if (!check.rows.length) break;
    bookingCode = generateBookingCode();
  }

  const patientUserId = req.user?.id ?? null;

  try {
    const { rows } = await pool.query(
      `INSERT INTO appointments
         (chamber_id, appointment_date, time_slot, booking_code,
          patient_name, patient_phone, patient_email, patient_age,
          service, notes, patient_user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id, booking_code, appointment_date::text, time_slot, status`,
      [
        d.chamberId, d.date, d.timeSlot, bookingCode,
        d.patientName, d.patientPhone, d.patientEmail || null, d.patientAge ?? null,
        d.service ?? null, d.notes ?? null, patientUserId,
      ],
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "23505") {
      res.status(409).json({ error: "That time slot was just taken. Please pick another." });
      return;
    }
    throw err;
  }
});

// GET /api/appointments — role-filtered list
router.get("/", requireAuth, async (req, res) => {
  const { user } = req;
  let query: string;
  let params: unknown[];

  if (user!.role === "admin" || user!.role === "doctor") {
    query = `
      SELECT a.id, a.appointment_date::text, a.time_slot, a.booking_code, a.status,
             a.patient_name, a.patient_phone, a.service, a.notes,
             a.doctor_user_id, a.patient_user_id,
             c.name AS chamber_name, c.address AS chamber_address, c.phone AS chamber_phone,
             u.full_name AS doctor_name
      FROM appointments a
      JOIN chambers c ON c.id = a.chamber_id
      LEFT JOIN users u ON u.id = a.doctor_user_id
      ORDER BY a.appointment_date DESC, a.time_slot
      LIMIT 200`;
    params = [];
  } else {
    query = `
      SELECT a.id, a.appointment_date::text, a.time_slot, a.booking_code, a.status,
             a.service, a.notes,
             c.name AS chamber_name, c.address AS chamber_address, c.phone AS chamber_phone
      FROM appointments a
      JOIN chambers c ON c.id = a.chamber_id
      WHERE a.patient_user_id = $1
      ORDER BY a.appointment_date DESC, a.time_slot`;
    params = [user!.id];
  }
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

// GET /api/appointments/unassigned — doctor: all appointments not yet claimed
router.get("/unassigned", requireAuth, requireRole("doctor"), async (req, res) => {
  const { rows } = await pool.query(
    `SELECT a.id, a.appointment_date::text, a.time_slot, a.booking_code, a.status,
            a.patient_name, a.patient_phone, a.service, a.notes,
            c.name AS chamber_name
     FROM appointments a
     JOIN chambers c ON c.id = a.chamber_id
     WHERE a.doctor_user_id IS NULL AND a.status NOT IN ('cancelled')
     ORDER BY a.appointment_date ASC, a.time_slot`,
  );
  res.json(rows);
});

// PATCH /api/appointments/:id/claim — doctor claims an unassigned appointment
router.patch("/:id/claim", requireAuth, requireRole("doctor"), async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE appointments SET doctor_user_id = $1
     WHERE id = $2 AND doctor_user_id IS NULL
     RETURNING id`,
    [req.user!.id, id],
  );
  if (!result.rows.length) {
    res.status(409).json({ error: "Appointment already claimed or not found." });
    return;
  }
  res.json({ ok: true });
});

// GET /api/appointments/today — doctor: today's appointments
router.get("/today", requireAuth, requireRole("doctor"), async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const { rows } = await pool.query(
    `SELECT a.id, a.time_slot, a.status, a.patient_name, a.service,
            c.name AS chamber_name
     FROM appointments a JOIN chambers c ON c.id = a.chamber_id
     WHERE a.doctor_user_id = $1 AND a.appointment_date = $2
     ORDER BY a.time_slot`,
    [req.user!.id, today],
  );
  res.json(rows);
});

// GET /api/appointments/stats — dashboard stats
router.get("/stats", requireAuth, async (req, res) => {
  const { user } = req;
  const today = new Date().toISOString().slice(0, 10);

  if (user!.role === "admin" || user!.role === "doctor") {
    const [patients, all, upcoming, recent] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role='patient' AND is_active=true"),
      pool.query("SELECT COUNT(*) FROM appointments"),
      pool.query("SELECT COUNT(*) FROM appointments WHERE appointment_date >= $1 AND status != 'cancelled'", [today]),
      pool.query(
        `SELECT a.id, a.appointment_date::text, a.time_slot, a.patient_name, a.status, c.name AS chamber_name
         FROM appointments a JOIN chambers c ON c.id = a.chamber_id
         ORDER BY a.created_at DESC LIMIT 8`,
      ),
    ]);
    res.json({
      patients: Number(patients.rows[0].count),
      all: Number(all.rows[0].count),
      upcoming: Number(upcoming.rows[0].count),
      recent: recent.rows,
    });
  } else {
    const [upcomingC, pastC] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM appointments WHERE patient_user_id=$1 AND appointment_date>=$2 AND status!='cancelled'", [user!.id, today]),
      pool.query("SELECT COUNT(*) FROM appointments WHERE patient_user_id=$1 AND appointment_date<$2", [user!.id, today]),
    ]);
    res.json({
      upcoming: Number(upcomingC.rows[0].count),
      past: Number(pastC.rows[0].count),
    });
  }
});

// PATCH /api/appointments/:id — update status and/or doctor assignment
router.patch("/:id", requireAuth, requireRole("doctor", "admin"), async (req, res) => {
  const { id } = req.params;
  const schema = z.object({
    status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show", "follow_up"]).optional(),
    doctor_user_id: z.string().uuid().nullable().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const current = await pool.query("SELECT status, doctor_user_id FROM appointments WHERE id=$1", [id]);
  if (!current.rows.length) { res.status(404).json({ error: "Not found" }); return; }

  const sets: string[] = [];
  const vals: unknown[] = [];
  let i = 1;
  if (parsed.data.status !== undefined) { sets.push(`status=$${i++}`); vals.push(parsed.data.status); }
  if (parsed.data.doctor_user_id !== undefined) { sets.push(`doctor_user_id=$${i++}`); vals.push(parsed.data.doctor_user_id); }
  sets.push("updated_at=NOW()");
  vals.push(id);

  await pool.query(`UPDATE appointments SET ${sets.join(",")} WHERE id=$${i}`, vals);

  if (parsed.data.status) {
    await pool.query(
      "INSERT INTO appointment_status_logs (appointment_id, from_status, to_status, changed_by) VALUES ($1,$2,$3,$4)",
      [id, current.rows[0].status, parsed.data.status, req.user!.id],
    );
  }
  res.json({ success: true });
});

// PATCH /api/appointments/:id/cancel — patient can cancel own appointment
router.patch("/:id/cancel", requireAuth, async (req, res) => {
  const { id } = req.params;
  const appt = await pool.query("SELECT status, patient_user_id FROM appointments WHERE id=$1", [id]);
  if (!appt.rows.length) { res.status(404).json({ error: "Not found" }); return; }
  const row = appt.rows[0];
  if (req.user!.role === "patient" && row.patient_user_id !== req.user!.id) {
    res.status(403).json({ error: "Forbidden" }); return;
  }
  await pool.query("UPDATE appointments SET status='cancelled', updated_at=NOW() WHERE id=$1", [id]);
  await pool.query(
    "INSERT INTO appointment_status_logs (appointment_id, from_status, to_status, changed_by) VALUES ($1,$2,'cancelled',$3)",
    [id, row.status, req.user!.id],
  );
  res.json({ success: true });
});

// GET /api/appointments/patients — doctor: unique patients list
router.get("/patients", requireAuth, requireRole("doctor"), async (req, res) => {
  const { rows } = await pool.query(
    `SELECT DISTINCT ON (COALESCE(patient_user_id::text, patient_phone))
       patient_user_id, patient_name, patient_phone, appointment_date
     FROM appointments
     WHERE doctor_user_id = $1
     ORDER BY COALESCE(patient_user_id::text, patient_phone), appointment_date DESC`,
    [req.user!.id],
  );
  res.json(rows);
});

export default router;
