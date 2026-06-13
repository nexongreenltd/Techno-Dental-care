import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { z } from "zod";

const router = Router();

// GET /api/chambers — public
router.get("/", async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, slug, name, address, phone, map_url, available_days, start_hour, end_hour
     FROM chambers WHERE is_active = true ORDER BY created_at`,
  );
  res.json(rows);
});

// POST /api/chambers — admin only
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const schema = z.object({
    slug: z.string().min(1).max(100),
    name: z.string().min(1).max(200),
    address: z.string().min(1),
    phone: z.string().min(1).max(30),
    map_url: z.string().optional(),
    available_days: z.array(z.number().int().min(0).max(6)).default([1, 2, 3, 4, 5]),
    start_hour: z.number().int().min(0).max(23).default(9),
    end_hour: z.number().int().min(1).max(24).default(17),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const d = parsed.data;
  const { rows } = await pool.query(
    `INSERT INTO chambers (slug, name, address, phone, map_url, available_days, start_hour, end_hour)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [d.slug, d.name, d.address, d.phone, d.map_url ?? null, d.available_days, d.start_hour, d.end_hour],
  );
  res.status(201).json(rows[0]);
});

export default router;
