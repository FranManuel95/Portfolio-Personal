import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// Helper para extraer mensaje de error de forma segura
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "No se pudo enviar el mensaje.";
  }
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject = "", message, company = "" } = await req.json();

    // Honeypot
    if (typeof company === "string" && company.trim() !== "") {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // Validación
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Faltan campos obligatorios." }), {
        status: 400,
      });
    }
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Email inválido." }), { status: 400 });
    }

    const clean = (s: string) => String(s ?? "").toString().trim();
    const _name = clean(name).slice(0, 100);
    const _email = clean(email).slice(0, 200);
    const _subject = clean(subject).slice(0, 140) || "Contacto desde portfolio";
    const _message = clean(message).slice(0, 2000);

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO;
    const from = process.env.CONTACT_FROM || user;

    if (!host || !user || !pass || !to || !from) {
      return new Response(
        JSON.stringify({
          error:
            "Servidor de email no configurado. Define SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO y CONTACT_FROM.",
        }),
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
        <h2>Nuevo mensaje desde el portfolio</h2>
        <p><strong>Nombre:</strong> ${_name}</p>
        <p><strong>Email:</strong> ${_email}</p>
        <p><strong>Asunto:</strong> ${_subject}</p>
        <p><strong>Mensaje:</strong></p>
        <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px;border:1px solid #eee;">${_message}</pre>
      </div>
    `;

    await transporter.sendMail({
      from,
      to,
      subject: `📨 ${_subject}`,
      replyTo: _email,
      text: `Nombre: ${_name}\nEmail: ${_email}\nAsunto: ${_subject}\n\n${_message}`,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    return new Response(
      JSON.stringify({ error: getErrorMessage(err) }),
      { status: 500 }
    );
  }
}
