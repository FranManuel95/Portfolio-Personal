import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const runtime = "nodejs";

function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function makeTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error("SMTP no configurado.");
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

function deriveCode(email: string, issuedAt: number, secret: string) {
  const h = crypto.createHmac("sha256", secret).update(`${email}.${issuedAt}`).digest("hex");
  const num = parseInt(h.slice(0, 8), 16) % 1_000_000;
  return num.toString().padStart(6, "0");
}
function signToken(email: string, issuedAt: number, secret: string) {
  const payload = `${email}.${issuedAt}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const b64 = Buffer.from(email, "utf8").toString("base64url");
  return `${b64}.${issuedAt}.${sig}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email || !isValidEmail(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });

    const secret = process.env.EMAIL_CODE_SECRET;
    if (!secret) return NextResponse.json({ error: "EMAIL_CODE_SECRET no definido." }, { status: 500 });

    const issuedAt = Date.now();
    const code = deriveCode(email, issuedAt, secret);
    const token = signToken(email, issuedAt, secret);

    const transporter = makeTransport();
    const from = process.env.CONTACT_FROM || process.env.SMTP_USER!;
    await transporter.verify();

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
        <h2>Tu código de verificación</h2>
        <p>Usa este código en el formulario:</p>
        <p style="font-size:24px;font-weight:700;letter-spacing:4px">${code}</p>
        <p style="color:#666">Caduca en 10 minutos.</p>
      </div>
    `;
    await transporter.sendMail({ from, to: email, subject: "Código de verificación (portfolio)", text: `Tu código: ${code}`, html });

    return NextResponse.json({ ok: true, token }, { status: 200 });
  } catch (err) {
    console.error("REQUEST-CODE ERROR:", err);
    return NextResponse.json({ error: "No se pudo enviar el código." }, { status: 500 });
  }
}
