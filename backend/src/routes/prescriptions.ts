import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

const medicineSchema = z.object({
  name: z.string().min(1).max(100),
  dosage: z.string().max(50).optional(),
  frequency: z.string().max(80).optional(),
  duration: z.string().max(60).optional(),
  notes: z.string().max(200).optional(),
});

const createSchema = z.object({
  appointment_id: z.string().uuid().optional(),
  patient_id: z.string().uuid().optional(),
  patient_name: z.string().min(1).max(100),
  patient_age: z.number().int().min(0).max(150).optional(),
  patient_phone: z.string().max(30).optional(),
  diagnosis: z.string().min(1),
  chief_complaint: z.string().optional(),
  medicines: z.array(medicineSchema).default([]),
  instructions: z.string().optional(),
  follow_up_date: z.string().optional(),
});

// POST /api/prescriptions — doctor only
router.post("/", requireAuth, requireRole("doctor"), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const d = parsed.data;

  const { rows } = await pool.query(
    `INSERT INTO prescriptions
       (appointment_id, doctor_id, patient_id, patient_name, patient_age, patient_phone,
        diagnosis, chief_complaint, medicines, instructions, follow_up_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      d.appointment_id ?? null, req.user!.id, d.patient_id ?? null,
      d.patient_name, d.patient_age ?? null, d.patient_phone ?? null,
      d.diagnosis, d.chief_complaint ?? null, JSON.stringify(d.medicines),
      d.instructions ?? null, d.follow_up_date ?? null,
    ],
  );
  res.status(201).json(rows[0]);
});

// GET /api/prescriptions — role-filtered
router.get("/", requireAuth, async (req, res) => {
  const { user } = req;
  let query: string;
  let params: unknown[];

  if (user!.role === "doctor") {
    query = `
      SELECT p.*, u.full_name AS doctor_name
      FROM prescriptions p
      LEFT JOIN users u ON u.id = p.doctor_id
      WHERE p.doctor_id = $1
      ORDER BY p.created_at DESC`;
    params = [user!.id];
  } else if (user!.role === "admin") {
    query = `
      SELECT p.*, u.full_name AS doctor_name
      FROM prescriptions p
      LEFT JOIN users u ON u.id = p.doctor_id
      ORDER BY p.created_at DESC
      LIMIT 200`;
    params = [];
  } else {
    query = `
      SELECT p.*, u.full_name AS doctor_name
      FROM prescriptions p
      LEFT JOIN users u ON u.id = p.doctor_id
      WHERE p.patient_id = $1
      ORDER BY p.created_at DESC`;
    params = [user!.id];
  }
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

// GET /api/prescriptions/:id — single
router.get("/:id", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.*, u.full_name AS doctor_name, u.specialization AS doctor_specialization
     FROM prescriptions p
     LEFT JOIN users u ON u.id = p.doctor_id
     WHERE p.id = $1`,
    [req.params.id],
  );
  if (!rows.length) { res.status(404).json({ error: "Not found" }); return; }
  const rx = rows[0];
  const { user } = req;
  if (
    user!.role !== "admin" &&
    rx.doctor_id !== user!.id &&
    rx.patient_id !== user!.id
  ) {
    res.status(403).json({ error: "Forbidden" }); return;
  }
  res.json(rx);
});

// PATCH /api/prescriptions/:id — doctor can update own prescriptions
router.patch("/:id", requireAuth, requireRole("doctor", "admin"), async (req, res) => {
  const schema = createSchema.partial();
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const existing = await pool.query("SELECT doctor_id FROM prescriptions WHERE id=$1", [req.params.id]);
  if (!existing.rows.length) { res.status(404).json({ error: "Not found" }); return; }
  if (req.user!.role === "doctor" && existing.rows[0].doctor_id !== req.user!.id) {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const d = parsed.data;
  const sets: string[] = ["updated_at=NOW()"];
  const vals: unknown[] = [];
  let i = 1;
  const fields: [string, unknown][] = [
    ["diagnosis", d.diagnosis],
    ["chief_complaint", d.chief_complaint],
    ["medicines", d.medicines !== undefined ? JSON.stringify(d.medicines) : undefined],
    ["instructions", d.instructions],
    ["follow_up_date", d.follow_up_date],
    ["patient_name", d.patient_name],
    ["patient_age", d.patient_age],
  ];
  for (const [col, val] of fields) {
    if (val !== undefined) { sets.push(`${col}=$${i++}`); vals.push(val); }
  }
  vals.push(req.params.id);
  const { rows } = await pool.query(
    `UPDATE prescriptions SET ${sets.join(",")} WHERE id=$${i} RETURNING *`,
    vals,
  );
  res.json(rows[0]);
});

export default router;
