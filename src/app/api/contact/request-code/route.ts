import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const runtime = "nodejs";

/** Validación básica de email */
const isValidEmail = (v: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Lee el email de forma robusta (JSON, texto JSON, x-www-form-urlencoded) */
const safeReadEmail = async (req: NextRequest): Promise<string | undefined> => {
  const ct = req.headers.get("content-type") ?? "";

  // application/json correctamente declarado
  if (ct.includes("application/json")) {
    try {
      const data = (await req.json()) as { email?: string };
      return data?.email;
    } catch {
      // cae al siguiente intento
    }
  }

  // texto bruto: intentamos parsear JSON aunque el header no coincida
  const raw = await req.text();

  try {
    const data = JSON.parse(raw) as { email?: string };
    if (typeof data?.email === "string") return data.email;
  } catch {
    // no era JSON
  }

  // application/x-www-form-urlencoded
  try {
    const params = new URLSearchParams(raw);
    const e = params.get("email");
    if (e) return e;
  } catch {
    // ignoramos
  }

  return undefined;
};

/** Deriva el código 6 dígitos a partir de (email, issuedAt, secret) */
const deriveCode = (email: string, issuedAt: number, secret: string): string => {
  const h = crypto.createHmac("sha256", secret).update(`${email}.${issuedAt}`).digest("hex");
  const num = parseInt(h.slice(0, 8), 16) % 1_000_000;
  return num.toString().padStart(6, "0");
};

/** Firma token: b64(email).issuedAt.hmac */
const signToken = (email: string, issuedAt: number, secret: string): string => {
  const payload = `${email}.${issuedAt}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const b64 = Buffer.from(email, "utf8").toString("base64url");
  return `${b64}.${issuedAt}.${sig}`;
};

/** Crea transporter SMTP (NodeMailer) */
const makeTransport = (): nodemailer.Transporter => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error("SMTP no configurado.");
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

export async function POST(req: NextRequest) {
  try {
    const email = await safeReadEmail(req);
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Email inválido." }, { status: 400 });
    }

    const secret = process.env.EMAIL_CODE_SECRET;
    if (!secret) {
      return NextResponse.json({ ok: false, error: "EMAIL_CODE_SECRET no definido." }, { status: 500 });
    }

    const issuedAt = Date.now();
    const code = deriveCode(email, issuedAt, secret);
    const token = signToken(email, issuedAt, secret);

    // Bypass solo en desarrollo si falta SMTP
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.CONTACT_FROM || user;

    if (!host || !user || !pass) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[DEV] OTP para", email, "=>", code);
        return NextResponse.json({ ok: true, token }, { status: 200 });
      }
      return NextResponse.json({ ok: false, error: "SMTP incompleto." }, { status: 500 });
    }

    // Transporter + verify con errores legibles en desarrollo
    let transporter: nodemailer.Transporter;
    try {
      transporter = makeTransport();
    } catch (err) {
      const msg =
        process.env.NODE_ENV !== "production" && err instanceof Error
          ? `SMTP create: ${err.message}`
          : "No se pudo inicializar SMTP.";
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }

    try {
      await transporter.verify();
    } catch (err) {
      const msg =
        process.env.NODE_ENV !== "production" && err instanceof Error
          ? `SMTP verify: ${err.message}`
          : "No se pudo verificar SMTP.";
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }

    try {
      await transporter.sendMail({
        from,
        to: email,
        subject: "Código de verificación (portfolio)",
        text: `Tu código: ${code}\nCaduca en 10 minutos.`,
        html: `<div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
                 <h2>Tu código de verificación</h2>
                 <p>Usa este código en el formulario:</p>
                 <p style="font-size:24px;font-weight:700;letter-spacing:4px">${code}</p>
                 <p style="color:#555">Caduca en 10 minutos.</p>
               </div>`,
      });
    } catch (err) {
      const msg =
        process.env.NODE_ENV !== "production" && err instanceof Error
          ? `SMTP send: ${err.message}`
          : "No se pudo enviar el correo.";
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }

    return NextResponse.json({ ok: true, token }, { status: 200 });
  } catch (err) {
    const msg =
      process.env.NODE_ENV !== "production" && err instanceof Error
        ? err.message
        : "No se pudo enviar el código.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
