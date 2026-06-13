import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(2).max(100),
  phone: z.string().max(30).optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(1), // email OR phone number
  password: z.string(),
});

function signToken(user: { id: string; email: string; role: string; full_name: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );
}

function safeUser(u: Record<string, unknown>) {
  return { id: u.id, email: u.email, full_name: u.full_name, phone: u.phone ?? null, role: u.role, gender: u.gender ?? null, dob: u.dob ?? null };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }
  const { email, password, full_name, phone } = parsed.data;

  const client = await pool.connect();
  try {
    const existing = await client.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await client.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, 'patient')
       RETURNING id, email, full_name, phone, role`,
      [email.toLowerCase(), hash, full_name, phone ?? null],
    );
    const user = result.rows[0];
    res.status(201).json({ token: signToken(user), user: safeUser(user) });
  } finally {
    client.release();
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { identifier, password } = parsed.data;
  const id = identifier.trim();

  // Match by email (case-insensitive) OR by phone (exact or normalised)
  const result = await pool.query(
    `SELECT * FROM users
     WHERE (LOWER(email) = $1 OR phone = $1 OR REPLACE(phone, '-', '') = $2)
     AND is_active = true
     LIMIT 1`,
    [id.toLowerCase(), id.replace(/[-\s]/g, "")],
  );
  if (!result.rows.length) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  res.json({ token: signToken(user), user: safeUser(user) });
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  const result = await pool.query(
    "SELECT id, email, full_name, phone, role, gender, dob FROM users WHERE id = $1 AND is_active = true",
    [req.user!.id],
  );
  if (!result.rows.length) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(safeUser(result.rows[0]));
});

// PATCH /api/auth/me — update own profile
router.patch("/me", requireAuth, async (req, res) => {
  const schema = z.object({
    full_name: z.string().min(2).max(100).optional(),
    phone: z.string().max(30).optional(),
    gender: z.string().max(20).optional(),
    dob: z.string().optional(),
    password: z.string().min(6).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { full_name, phone, gender, dob, password } = parsed.data;
  const sets: string[] = [];
  const vals: unknown[] = [];
  let i = 1;
  if (full_name) { sets.push(`full_name = $${i++}`); vals.push(full_name); }
  if (phone !== undefined) { sets.push(`phone = $${i++}`); vals.push(phone || null); }
  if (gender !== undefined) { sets.push(`gender = $${i++}`); vals.push(gender || null); }
  if (dob !== undefined) { sets.push(`dob = $${i++}`); vals.push(dob || null); }
  if (password) { sets.push(`password_hash = $${i++}`); vals.push(await bcrypt.hash(password, 10)); }
  sets.push(`updated_at = NOW()`);
  vals.push(req.user!.id);
  await pool.query(`UPDATE users SET ${sets.join(", ")} WHERE id = $${i}`, vals);
  const updated = await pool.query(
    "SELECT id, email, full_name, phone, role, gender, dob FROM users WHERE id = $1",
    [req.user!.id],
  );
  res.json(safeUser(updated.rows[0]));
});

export default router;
