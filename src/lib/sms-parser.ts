// Lightweight SMS parser for Somali mobile-money providers (EVC/Zaad/Sahal).
// Client-side, deterministic. Returns a parsed transaction draft when confident.

export type ParsedSms = {
  amount: number;
  kind: "income" | "expense";
  provider: "EVC" | "Zaad" | "Sahal" | "Other";
  title: string;
  category:
    | "Food" | "Transport" | "Shopping" | "Bills" | "Salary" | "Transfer"
    | "Business" | "Education" | "Health" | "Airtime" | "Other";
  reference: string | null;
  occurredAt: string; // ISO
};

const providerFromSender = (sender: string | null, body: string): ParsedSms["provider"] => {
  const s = ((sender ?? "") + " " + body).toLowerCase();
  if (s.includes("evc") || s.includes("hormuud")) return "EVC";
  if (s.includes("zaad") || s.includes("telesom")) return "Zaad";
  if (s.includes("sahal") || s.includes("somtel")) return "Sahal";
  return "Other";
};

const CATEGORY_RULES: [RegExp, ParsedSms["category"]][] = [
  [/salary|payroll|wages/i, "Salary"],
  [/transfer|sent to|received from/i, "Transfer"],
  [/food|restaurant|cafe|bakaar|grocery|market|supermarket/i, "Food"],
  [/uber|taxi|bajaj|bus|fare|ride|transport|fuel|petrol/i, "Transport"],
  [/beco|electric|water|internet|wifi|bill|rent/i, "Bills"],
  [/airtime|top.?up|data bundle|topup/i, "Airtime"],
  [/school|tuition|book|course|university/i, "Education"],
  [/hospital|clinic|pharmacy|medicine|doctor/i, "Health"],
  [/shop|store|mall|purchase|bought/i, "Shopping"],
  [/business|invoice|client|freelance/i, "Business"],
];

export const inferCategory = (title: string, body: string): ParsedSms["category"] => {
  const hay = `${title} ${body}`;
  for (const [re, cat] of CATEGORY_RULES) if (re.test(hay)) return cat;
  return "Other";
};

// SHA-256 hex hash used to dedupe by SMS body
export async function hashSms(sender: string | null, body: string): Promise<string> {
  const norm = `${(sender ?? "").trim().toLowerCase()}|${body.trim().replace(/\s+/g, " ")}`;
  const buf = new TextEncoder().encode(norm);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Very forgiving amount extractor: "$1,200.00", "USD 200", "200.50 USD", "SoSh 45000"
const AMOUNT_RE =
  /(?:\$|usd|so?sh|sos)?\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{1,2})?|[0-9]+(?:[.,][0-9]{1,2})?)\s*(?:usd|so?sh|sos)?/i;

const REF_RE = /\b(?:ref(?:erence)?|txn|id)[:\s#]*([A-Z0-9\-]{4,})/i;

const RECEIVED_RE =
  /(received|deposit|credited|salary|refund|payment from|you have received)/i;
const SENT_RE = /(sent|paid|withdraw|debited|purchase|bought|payment to|charged)/i;

export function parseSms(sender: string | null, body: string): ParsedSms | null {
  const amountMatch = body.match(AMOUNT_RE);
  if (!amountMatch) return null;
  const raw = amountMatch[1].replace(/,/g, "");
  const amount = Number(raw);
  if (!isFinite(amount) || amount <= 0) return null;

  const isIncome = RECEIVED_RE.test(body) && !SENT_RE.test(body.split(/received/i)[0] ?? "");
  const kind: ParsedSms["kind"] = isIncome ? "income" : SENT_RE.test(body) ? "expense" : "expense";

  const provider = providerFromSender(sender, body);
  const ref = body.match(REF_RE)?.[1] ?? null;

  // Title: try "from X" / "to X", else first short clause
  const from = body.match(/from\s+([A-Z][A-Za-z0-9 &'.-]{2,40})/);
  const to = body.match(/to\s+([A-Z][A-Za-z0-9 &'.-]{2,40})/);
  const title =
    (kind === "income" ? from?.[1] : to?.[1]) ??
    (kind === "income" ? "Money received" : "Payment sent");

  return {
    amount,
    kind,
    provider,
    title: title.trim().replace(/\s+/g, " "),
    category: inferCategory(title, body),
    reference: ref,
    occurredAt: new Date().toISOString(),
  };
}

// Sample SMS pool for the in-app simulator
export const SAMPLE_SMS: { sender: string; body: string }[] = [
  {
    sender: "EVCPlus",
    body:
      "EVCPlus: You have received $1,200.00 from HORMUUD TELECOM (Salary). New balance: $2,340.10. Ref: 9F82K1",
  },
  {
    sender: "EVCPlus",
    body:
      "EVCPlus: You paid $42.50 to BAKAARAHA MARKET for grocery. New balance: $2,297.60. Ref: 7A11XZ",
  },
  {
    sender: "Zaad",
    body:
      "Zaad: You have received $350.00 from AHMED CLIENT (Freelance). Balance: $850.00. Ref: ZD44K9",
  },
  {
    sender: "EVCPlus",
    body:
      "EVCPlus: You paid $78.00 to BECO ELECTRIC for bill. New balance: $2,219.60. Ref: BC22PL",
  },
  {
    sender: "Sahal",
    body:
      "Sahal: You paid $6.00 to BAJAJ RIDE for transport. Balance: $210.00. Ref: SH01QQ",
  },
  {
    sender: "EVCPlus",
    body:
      "EVCPlus: You paid $10.00 to HORMUUD TOPUP for airtime. Balance: $2,209.60. Ref: TP99AA",
  },
];
