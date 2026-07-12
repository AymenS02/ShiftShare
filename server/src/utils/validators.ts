import mongoose from "mongoose";

export function ensureObjectId(value: string, field: string) {
  if (!mongoose.isValidObjectId(value)) {
    throw new Error(`Invalid ${field}`);
  }
  return value;
}

export function ensureEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email format");
  }
  return email;
}

export function ensureDateISO(value: string, field: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid ${field}`);
  }
  return value;
}

export function ensureTimeHHMM(value: string, field: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    throw new Error(`Invalid ${field}`);
  }
  return value;
}

