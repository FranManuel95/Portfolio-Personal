import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const runtime = "nodejs";

type NodeMailerError = Error & { code?: string; response?: string };

function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function clean(s: unknown, max = 2000) { return String(s ?? "").trim().slice(0, max); }
function friendly(err: unknown): string {
  const e = err as NodeMailerError;
  switch (e?.code) {
    case "ENOTFOUND":
    case "EAI_AGAIN": return "No se pudo resolver el host SMTP (SMTP_HOST).";
    case "EAUTH": return "Credenciales SMTP inválidas (SMTP_USER/SMTP_PASS o App Password).";
    case "ECONNECTION": return "No se pudo conectar al SMTP (puerto/SSL).";
    case "ETIMEDOUT": return "Timeout conectando al SMTP.";
    default: return e?.message || "Error enviando el correo.";
  }
}

// OTP helpers
function deriveCode(email: string, issuedAt: number, secret: string) {
  const h = crypto.createHmac("sha256", secret).update(`${email}.${issuedAt}`).digest("hex");
  const num = parseInt(h.slice(0, 8), 16) % 1_000_000;
  return num.toString().padStart(6, "0");
}
function verifyTokenAndGet(emailInput: string, token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Token inválido.");
  const email = Buffer.from(parts[0], "base64url").toString("utf8");
  if (email.toLowerCase() !== emailInput.toLowerCase()) throw new Error("Token/email no coinciden.");
  const payload = `${email}.${parts[1]}`;
  const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(parts[2], "hex"), Buffer.from(expectedSig, "hex"))) {
    throw new Error("Firma inválida.");
  }
  const issuedAt = Number(parts[1]);
  if (!Number.isFinite(issuedAt)) throw new Error("Token corrupto.");
  return { issuedAt };
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject = "", message, company = "", code, verifyToken } = await req.json();

    if (typeof company === "string" && company.trim() !== "") return NextResponse.json({ ok: true }, { status: 200 });

    if (!name || !email || !message) return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    if (!code || !verifyToken) return NextResponse.json({ error: "Falta verificación (código)." }, { status: 400 });

    const secret = process.env.EMAIL_CODE_SECRET;
    if (!secret) return NextResponse.json({ error: "EMAIL_CODE_SECRET no definido." }, { status: 500 });

    const { issuedAt } = verifyTokenAndGet(email, verifyToken, secret);
    if (Date.now() - issuedAt > 10 * 60 * 1000) return NextResponse.json({ error: "El código ha caducado." }, { status: 400 });
    const expected = deriveCode(email, issuedAt, secret);
    if (code !== expected) return NextResponse.json({ error: "Código incorrecto." }, { status: 400 });

    const _name = clean(name, 100);
    const _email = clean(email, 200);
    const _subject = clean(subject || "Contacto desde portfolio", 140);
    const _message = clean(message, 2000);

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO;
    const from = process.env.CONTACT_FROM || user;
    if (!host || !user || !pass || !to || !from) {
      return NextResponse.json({ error: "SMTP incompleto: define SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    try { await transporter.verify(); } catch (e) { return NextResponse.json({ error: friendly(e) }, { status: 500 }); }

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
        <h2>Nuevo mensaje desde el portfolio</h2>
        <p><strong>Nombre:</strong> ${_name}</p>
        <p><strong>Email verificado:</strong> ${_email}</p>
        <p><strong>Asunto:</strong> ${_subject}</p>
        <p><strong>Mensaje:</strong></p>
        <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px;border:1px solid #eee;">${_message}</pre>
      </div>
    `;

    await transporter.sendMail({
      from, to, subject: `📨 ${_subject}`, replyTo: _email,
      text: `Nombre: ${_name}\nEmail verificado: ${_email}\nAsunto: ${_subject}\n\n${_message}`,
      html,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    return NextResponse.json({ error: "No se pudo enviar el mensaje." }, { status: 500 });
  }
}
