import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /api/users — admin: list all users
router.get("/", requireAuth, requireRole("admin", "doctor"), async (req, res) => {
  const { role } = req.query;
  let query = "SELECT id, email, full_name, phone, role, is_active, created_at, specialization FROM users";
  const params: unknown[] = [];
  if (role && ["patient", "doctor", "admin"].includes(role as string)) {
    query += " WHERE role = $1";
    params.push(role);
  }
  query += " ORDER BY created_at DESC";
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

// GET /api/users/doctors — list doctors (for appointment assignment — admin/all auth)
router.get("/doctors", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, full_name, email, specialization FROM users WHERE role='doctor' AND is_active=true ORDER BY full_name",
  );
  res.json(rows);
});

// POST /api/users — admin: create user with any role
router.post("/", requireAuth, requireRole("admin", "doctor"), async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    full_name: z.string().min(2).max(100),
    phone: z.string().max(30).optional(),
    role: z.enum(["patient", "doctor", "admin"]),
    specialization: z.string().max(100).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const { email, password, full_name, phone, role, specialization } = parsed.data;

  const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email.toLowerCase()]);
  if (existing.rows.length) { res.status(409).json({ error: "Email already registered" }); return; }

  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, phone, role, specialization)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, email, full_name, phone, role, specialization, created_at`,
    [email.toLowerCase(), hash, full_name, phone ?? null, role, specialization ?? null],
  );
  res.status(201).json(rows[0]);
});

// PATCH /api/users/:id — admin: change role, active status, specialization
router.patch("/:id", requireAuth, requireRole("admin", "doctor"), async (req, res) => {
  const schema = z.object({
    role: z.enum(["patient", "doctor", "admin"]).optional(),
    is_active: z.boolean().optional(),
    specialization: z.string().max(100).optional(),
    full_name: z.string().max(100).optional(),
    phone: z.string().max(30).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const sets: string[] = ["updated_at=NOW()"];
  const vals: unknown[] = [];
  let i = 1;
  const { role, is_active, specialization, full_name, phone } = parsed.data;
  if (role !== undefined) { sets.push(`role=$${i++}`); vals.push(role); }
  if (is_active !== undefined) { sets.push(`is_active=$${i++}`); vals.push(is_active); }
  if (specialization !== undefined) { sets.push(`specialization=$${i++}`); vals.push(specialization || null); }
  if (full_name !== undefined) { sets.push(`full_name=$${i++}`); vals.push(full_name); }
  if (phone !== undefined) { sets.push(`phone=$${i++}`); vals.push(phone || null); }

  vals.push(req.params.id);
  const { rows } = await pool.query(
    `UPDATE users SET ${sets.join(",")} WHERE id=$${i}
     RETURNING id, email, full_name, phone, role, is_active, specialization`,
    vals,
  );
  if (!rows.length) { res.status(404).json({ error: "User not found" }); return; }
  res.json(rows[0]);
});

// GET /api/users/treatment-history/:patientId — doctor or admin
router.get("/treatment-history/:patientId", requireAuth, requireRole("doctor", "admin"), async (req, res) => {
  const { rows } = await pool.query(
    `SELECT th.id, th.title, th.description, th.treated_at, u.full_name AS doctor_name
     FROM treatment_history th
     LEFT JOIN users u ON u.id = th.doctor_id
     WHERE th.patient_id = $1
     ORDER BY th.treated_at DESC`,
    [req.params.patientId],
  );
  res.json(rows);
});

// GET /api/users/my-history — patient gets own treatment history
router.get("/my-history", requireAuth, requireRole("patient"), async (req, res) => {
  const { rows } = await pool.query(
    `SELECT th.id, th.title, th.description, th.treated_at, u.full_name AS doctor_name
     FROM treatment_history th
     LEFT JOIN users u ON u.id = th.doctor_id
     WHERE th.patient_id = $1
     ORDER BY th.treated_at DESC`,
    [req.user!.id],
  );
  res.json(rows);
});

export default router;
