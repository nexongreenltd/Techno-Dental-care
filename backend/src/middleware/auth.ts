import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type JWTPayload = {
  id: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  full_name: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized — token missing" });
    return;
  }
  try {
    const token = auth.slice(7);
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized — invalid token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    try {
      req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET!) as JWTPayload;
    } catch {
      // continue without user
    }
  }
  next();
}
