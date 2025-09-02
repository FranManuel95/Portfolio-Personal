"use client";

import { useState } from "react";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper seguro para extraer mensaje de error
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Error desconocido.";
  }
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.status === "submitting") return;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setState({ status: "error", message: "Por favor, rellena los campos obligatorios." });
      return;
    }
    if (!EMAIL_RX.test(email)) {
      setState({ status: "error", message: "Introduce un email válido." });
      return;
    }
    if (company.trim() !== "") {
      // bot (honeypot)
      setState({ status: "success" });
      return;
    }

    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, company }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "No se pudo enviar el mensaje.");
      }

      setState({ status: "success" });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setState({ status: "error", message: getErrorMessage(err) });
    }
  }

  const disabled = state.status === "submitting" || state.status === "success";

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]"
      />
      <div className="relative surface max-w-3xl mx-auto p-6 md:p-8">
        <h2 className="headline text-3xl text-center mb-2">Contacto</h2>
        <p className="text-[var(--text-dim)] text-center mt-8 mb-6">
          ¿Hablamos? Cuéntame sobre la oportunidad o el proyecto.
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
                disabled={disabled}
                required
              />
            </label>

            <label className="text-sm text-[var(--text-dim)] text-left">
              Email *
              <input
                className="mt-1 w-full rounded-lg bg-[var(--bg-elev-2)] border border-[var(--line)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={disabled}
                required
                inputMode="email"
              />
            </label>
          </div>

          <label className="text-sm text-[var(--text-dim)] text-left">
            Asunto (opcional)
            <input
              className="mt-1 w-full rounded-lg bg-[var(--bg-elev-2)] border border-[var(--line)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="Sobre la vacante..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={disabled}
            />
          </label>

          <label className="text-sm text-[var(--text-dim)] text-left">
            Mensaje *
            <textarea
              className="mt-1 min-h-40 w-full rounded-lg bg-[var(--bg-elev-2)] border border-[var(--line)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="¿Qué necesitas? ¿Plazos, stack, alcance…?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={disabled}
              required
              maxLength={2000}
            />
            <span className="text-xs text-[var(--text-dim)]">{message.length}/2000</span>
          </label>

          {state.status === "error" && (
            <div className="text-red-400 text-sm">{state.message}</div>
          )}
          {state.status === "success" && (
            <div className="text-green-400 text-sm">
              ¡Gracias! He recibido tu mensaje y te responderé en breve.
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <button type="submit" className="btn btn-primary" disabled={disabled}>
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
