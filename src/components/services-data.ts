export type LogLine = {
  phase: "thinking" | "executing" | "notify";
  text: string;
};

export type AgentState = "active" | "waiting" | "done" | "idle";

export type Service = {
  id: "web" | "ai" | "auto" | "agents";
  title: string;
  role: string;
  accent: string;
  bgTint: string;
  tagline: string;
  items: string[];
  logs: LogLine[];
  spriteUrl: string;
};

export const SERVICES: Service[] = [
  {
    id: "web",
    title: "Desarrollo Web",
    role: "Full-stack Engineer",
    accent: "#60a5fa",
    bgTint: "rgba(96,165,250,0.08)",
    tagline: "Productos web rápidos, escalables y listos para producción",
    items: [
      "Next.js + React",
      "APIs REST/serverless",
      "Auth/pagos/DB cloud",
      "Deploy Vercel CI/CD",
    ],
    logs: [
      { phase: "thinking", text: "Analyzing stack: Next.js 15 · App Router · TS strict" },
      { phase: "thinking", text: "Plan: 1. scaffold, 2. auth, 3. DB, 4. deploy" },
      { phase: "executing", text: "CMD: npx create-next-app@latest shop --ts --tailwind" },
      { phase: "executing", text: "CMD: npm install @clerk/nextjs stripe @prisma/client" },
      { phase: "thinking", text: "Checking schema · users, orders, products" },
      { phase: "executing", text: "FILE_EDIT: /prisma/schema.prisma · +42 lines" },
      { phase: "executing", text: "CMD: npx prisma migrate dev --name init" },
      { phase: "executing", text: "FILE_EDIT: /app/api/checkout/route.ts · +68 lines" },
      { phase: "thinking", text: "Validating env vars · STRIPE_KEY · DATABASE_URL ok" },
      { phase: "executing", text: "CMD: npm run build · 0 errors · 0 warnings" },
      { phase: "executing", text: "CMD: git push origin main · Vercel webhook fired" },
      { phase: "notify", text: "Build successful · Deploy ready ✓" },
      { phase: "notify", text: "Preview: https://shop-git-main.vercel.app" },
    ],
    spriteUrl: "/sprites/dev-walk.png",
  },
  {
    id: "ai",
    title: "IA Generativa",
    role: "AI Architect",
    accent: "#a78bfa",
    bgTint: "rgba(167,139,250,0.08)",
    tagline: "Pipelines RAG y agentes LLM que entienden tu negocio",
    items: [
      "Sistemas RAG",
      "Agentes con memoria/tools",
      "Multi-modelo (OpenAI/Claude/Gemini)",
      "Optimización de costes",
    ],
    logs: [
      { phase: "thinking", text: "Analyzing corpus: 4.2k docs · PDF+MD · ~18M tokens" },
      { phase: "thinking", text: "Plan: chunk 512 · overlap 64 · embed text-embedding-3-large" },
      { phase: "executing", text: "CMD: python ingest.py --source ./data --chunker semantic" },
      { phase: "executing", text: "HTTP POST /v1/embeddings · 1280 batches · 200 OK" },
      { phase: "executing", text: "FILE_EDIT: /lib/vectorstore.ts · Pinecone upsert +312 vecs" },
      { phase: "thinking", text: "Routing: Claude Sonnet para razonamiento · Haiku para classify" },
      { phase: "executing", text: "FILE_EDIT: /agents/router.ts · tool-calling + memory store" },
      { phase: "executing", text: "HTTP POST /v1/messages · tokens_in=2314 tokens_out=612" },
      { phase: "thinking", text: "Evaluando recall@5 · 0.87 · precision 0.91 ✓" },
      { phase: "executing", text: "CMD: npm run eval · 48/50 golden passed" },
      { phase: "executing", text: "Cache hit-rate 62% · coste -44% vs baseline" },
      { phase: "notify", text: "RAG pipeline ready · endpoint /api/ask live" },
      { phase: "notify", text: "Human-in-the-loop: review de 2 respuestas ambiguas" },
    ],
    spriteUrl: "/sprites/ai-walk.png",
  },
  {
    id: "auto",
    title: "Automatización",
    role: "Workflow Hacker",
    accent: "#fb923c",
    bgTint: "rgba(251,146,60,0.08)",
    tagline: "Orquesta procesos y elimina el trabajo manual repetitivo",
    items: [
      "n8n end-to-end",
      "Webhooks/APIs",
      "Email/docs auto",
      "Pipelines validación",
    ],
    logs: [
      { phase: "thinking", text: "Mapping triggers: form submit → CRM → email → Slack" },
      { phase: "thinking", text: "Plan: 5 nodes · branching on lead_score > 70" },
      { phase: "executing", text: "CMD: n8n import:workflow --file lead-pipeline.json" },
      { phase: "executing", text: "HTTP POST /webhook/lead-in · 201 Created" },
      { phase: "executing", text: "NODE_EXEC: HubSpot.upsertContact · id=c_88213" },
      { phase: "thinking", text: "Score 82 → branch A: hot-lead track" },
      { phase: "executing", text: "NODE_EXEC: Gmail.sendTemplate · welcome_es · 200 OK" },
      { phase: "executing", text: "NODE_EXEC: GoogleDocs.create · propuesta_c_88213.pdf" },
      { phase: "thinking", text: "Validando payload · schema zod ok · retries=0" },
      { phase: "executing", text: "HTTP POST /slack/webhook · \"Nuevo lead hot 🔥\"" },
      { phase: "executing", text: "CMD: n8n execute --log · 14/14 nodes green" },
      { phase: "notify", text: "Workflow live · 1.2s avg · SLA cumplido ✓" },
      { phase: "notify", text: "Monitor: 247 ejecuciones hoy · 0 errores" },
    ],
    spriteUrl: "/sprites/auto-walk.png",
  },
  {
    id: "agents",
    title: "Agentes Inteligentes",
    role: "Agent Whisperer",
    accent: "#34d399",
    bgTint: "rgba(52,211,153,0.08)",
    tagline: "Agentes de voz y ops que operan 24/7 con tus sistemas",
    items: [
      "Voice 24/7 VAPI",
      "Agentes internos ops",
      "ElevenLabs/Twilio",
      "Integración CRM",
    ],
    logs: [
      { phase: "thinking", text: "Context: clinic reception · 24/7 · ES/EN · booking + FAQ" },
      { phase: "thinking", text: "Plan: VAPI voice → tool-calls → Calendly + CRM sync" },
      { phase: "executing", text: "CMD: vapi assistants create --model claude-sonnet" },
      { phase: "executing", text: "FILE_EDIT: /agents/receptionist.yaml · tools=[book, faq, handoff]" },
      { phase: "executing", text: "HTTP POST /elevenlabs/voice · voice_id=es-latam-f · 200 OK" },
      { phase: "thinking", text: "Intent detected: book_appointment · slot tomorrow 10:00" },
      { phase: "executing", text: "TOOL_CALL: calendar.create_event · evt_7721 confirmed" },
      { phase: "executing", text: "TOOL_CALL: hubspot.updateContact · stage=scheduled" },
      { phase: "thinking", text: "Confidence 0.62 on pricing query → escalate" },
      { phase: "executing", text: "HTTP POST /twilio/sms · handoff link → human agent" },
      { phase: "executing", text: "CMD: vapi deploy --env prod · healthcheck green" },
      { phase: "notify", text: "Agent online · 1 call live · avg latency 780ms ✓" },
      { phase: "notify", text: "Human-in-the-loop: approval required para refunds" },
    ],
    spriteUrl: "/sprites/agent-walk.png",
  },
];
