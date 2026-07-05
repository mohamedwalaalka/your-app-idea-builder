export type PwCheck = { ok: boolean; message?: string };

/** Strong password: 8+ chars, upper, lower, number, special. */
export function validatePassword(pw: string): PwCheck {
  if (pw.length < 8) return { ok: false, message: "Password must be at least 8 characters." };
  if (!/[A-Z]/.test(pw)) return { ok: false, message: "Add at least one uppercase letter." };
  if (!/[a-z]/.test(pw)) return { ok: false, message: "Add at least one lowercase letter." };
  if (!/[0-9]/.test(pw)) return { ok: false, message: "Add at least one number." };
  if (!/[^A-Za-z0-9]/.test(pw)) return { ok: false, message: "Add at least one special character." };
  return { ok: true };
}

export function validateEmail(email: string): PwCheck {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return ok ? { ok: true } : { ok: false, message: "Enter a valid email address." };
}

/** Map raw Supabase auth errors to friendly messages. */
export function friendlyAuthError(msg: string | undefined | null): string {
  const m = (msg ?? "").toLowerCase();
  if (!m) return "Something went wrong. Please try again.";
  if (m.includes("invalid login")) return "Incorrect email or password.";
  if (m.includes("email not confirmed")) return "Please confirm your email first.";
  if (m.includes("already registered") || m.includes("user already")) return "This email is already registered. Try signing in.";
  if (m.includes("password") && m.includes("pwned")) return "This password has been found in a data breach. Please choose another.";
  if (m.includes("network") || m.includes("failed to fetch")) return "Network error. Check your connection and try again.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  return msg!;
}
