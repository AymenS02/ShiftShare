import { NextFunction, Request, Response } from "express";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 120;

export function apiRateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const key = `${ip}:${req.path}`;
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      message: "Too many requests, please retry later",
    });
  }

  existing.count += 1;
  buckets.set(key, existing);
  next();
}

