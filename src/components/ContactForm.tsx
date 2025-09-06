"use client";

import { useState } from "react";

type FormState =
  | { status: "idle" }
  | { status: "code-sent"; token: string } // tenemos token y esperamos código
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Helpers seguros ---
function getErr(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Error desconocido.";
  }
}

/** Lee JSON solo si el Content-Type es application/json.
 *  Si no lo es, lee el texto y lanza un error legible.
 */
async function readJSON<T>(res: Response): Promise<T> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return (await res.json()) as T;
  }
  const text = await res.text();
  throw new Error(
    `La ruta devolvió contenido no-JSON (${res.status}). ${text.slice(0, 180)}`
  );
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [code, setCode] = useState(""); // código de verificación
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [sendingCode, setSendingCode] = useState(false);

  const disabledAll = state.status === "submitting" || state.status === "success";

  async function requestCode() {
    if (!EMAIL_RX.test(email)) {
      setState({ status: "error", message: "Introduce un email válido para enviar el código." });
      return;
    }
    setSendingCode(true);
    try {
      const res = await fetch("/api/contact/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await readJSON<{ ok?: boolean; token?: string; error?: string }>(res);
      if (!res.ok || !data.ok || !data.token) {
        throw new Error(data.error || "No se pudo enviar el código.");
      }
      setState({ status: "code-sent", token: data.token });
    } catch (err) {
      setState({ status: "error", message: getErr(err) });
    } finally {
      setSendingCode(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.status === "submitting" || state.status === "success") return;

    // Validaciones mínimas
    if (!name.trim() || !email.trim() || !message.trim()) {
      setState({ status: "error", message: "Por favor, rellena los campos obligatorios." });
      return;
    }
    if (!EMAIL_RX.test(email)) {
      setState({ status: "error", message: "Introduce un email válido." });
      return;
    }
    if (company.trim() !== "") {
      setState({ status: "success" }); // bot → no enviar, fingimos OK
      return;
    }
    if (state.status !== "code-sent") {
      setState({ status: "error", message: "Primero verifica tu email. Pulsa 'Enviar código'." });
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setState({ status: "error", message: "Código inválido. Debe tener 6 dígitos." });
      return;
    }

    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          company,
          code,
          verifyToken: state.token, // ← muy importante
        }),
      });
      const data = await readJSON<{ ok?: boolean; error?: string }>(res);
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo enviar el mensaje.");
      }
      setState({ status: "success" });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setCode("");
    } catch (err) {
      setState({ status: "error", message: getErr(err) });
    }
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]"
      />
      <div className="relative surface max-w-3xl mx-auto p-6 md:p-8">
        <h2 className="headline text-3xl text-center mb-2">Contacto</h2>
        <p className="text-[var(--text-dim)] text-center mt-6 mb-6">
          Verifica tu email para evitar suplantaciones y poder responderte.
        </p>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
          {/* Honeypot oculto */}
          <div className="hidden">
            <label>
              Empresa
              <input
                type="text"
                name="company"
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                tabIndex={-1}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-[var(--text-dim)] text-left">
              Nombre *
              <input
                className="mt-1 w-full rounded-lg bg-[var(--bg-elev-2)] border border-[var(--line)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={disabledAll}
              />
            </label>

            <label className="text-sm text-[var(--text-dim)] text-left">
              Email *
              <div className="mt-1 flex gap-2">
                <input
                  className="flex-1 rounded-lg bg-[var(--bg-elev-2)] border border-[var(--line)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  inputMode="email"
                  disabled={disabledAll || state.status === "code-sent"}
                />
                <button
                  type="button"
                  onClick={requestCode}
                  className="btn btn-ghost whitespace-nowrap"
                  disabled={
                    disabledAll ||
                    sendingCode ||
                    (state.status === "code-sent" && !!email) // ya enviado
                  }
                  title="Enviar código de verificación"
                >
                  {sendingCode ? "Enviando..." : state.status === "code-sent" ? "Código enviado" : "Enviar código"}
                </button>
              </div>
              {state.status === "code-sent" && (
                <p className="text-xs mt-1 text-[var(--text-dim)]">
                  Hemos enviado un código a{" "}
                  <span className="text-[var(--text)] font-medium">{email}</span>. Revísalo (caduca en 10 minutos).
                </p>
              )}
            </label>
          </div>

          <label className="text-sm text-[var(--text-dim)] text-left">
            Código de verificación *
            <input
              className="mt-1 w-full rounded-lg bg-[var(--bg-elev-2)] border border-[var(--line)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={disabledAll || state.status !== "code-sent"}
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
            />
          </label>

          <label className="text-sm text-[var(--text-dim)] text-left">
            Asunto (opcional)
            <input
              className="mt-1 w-full rounded-lg bg-[var(--bg-elev-2)] border border-[var(--line)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="Sobre la vacante..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={disabledAll}
            />
          </label>

          <label className="text-sm text-[var(--text-dim)] text-left">
            Mensaje *
            <textarea
              className="mt-1 min-h-40 w-full rounded-lg bg-[var(--bg-elev-2)] border border-[var(--line)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="¿Qué necesitas? ¿Plazos, stack, alcance…?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={disabledAll}
              required
              maxLength={2000}
            />
            <span className="text-xs text-[var(--text-dim)]">{message.length}/2000</span>
          </label>

          {state.status === "error" && <div className="text-red-400 text-sm">{state.message}</div>}
          {state.status === "success" && (
            <div className="text-green-400 text-sm">¡Gracias! Tu email ha sido verificado y el mensaje enviado.</div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <button type="submit" className="btn btn-primary" disabled={disabledAll}>
              {state.status === "submitting" ? "Enviando..." : "Enviar mensaje"}
            </button>

            <a
              className="btn btn-ghost"
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_TO ?? "tu-email@dominio.com"}?subject=${encodeURIComponent(
                subject || "Contacto desde portfolio"
              )}&body=${encodeURIComponent(`Hola, soy ${name} (${email}).\n\n${message}`)}`}
            >
              Prefiero email directo
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
