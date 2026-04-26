export type AgentState = "idle" | "active" | "waiting" | "done";

export type LogLine = {
  type: "thinking" | "executing" | "notify";
  text: string;
};

export type Service = {
  id: "web" | "ai" | "auto" | "agents";
  title: string;
  role: string;
  tagline: string;
  accent: string;
  bgTint: string;
  spriteFile: string;
  capabilities: string[];
  logs: LogLine[];
};

export const SERVICES: Service[] = [
  {
    id: "web",
    title: "Desarrollo Full-Stack",
    role: "Full-Stack Engineer",
    tagline: "Apps web de alto rendimiento con arquitectura moderna y escalable",
    accent: "#60a5fa",
    bgTint: "rgba(59,130,246,0.10)",
    spriteFile: "/sprites/dev-walk.png",
    capabilities: [
      "Next.js 15 + TypeScript",
      "APIs REST / GraphQL",
      "PostgreSQL + Redis",
      "CI/CD en Vercel",
    ],
    logs: [
      { type: "thinking", text: "Analizando requisitos del proyecto..." },
      { type: "executing", text: "npx create-next-app@latest --typescript" },
      { type: "thinking", text: "Diseñando arquitectura de componentes..." },
      { type: "executing", text: "npm install prisma @prisma/client zod" },
      { type: "executing", text: "git commit -m 'feat: auth middleware + JWT'" },
      { type: "thinking", text: "Optimizando Core Web Vitals..." },
      { type: "executing", text: "npm run build && vercel --prod" },
      { type: "notify", text: "Deploy completado · LCP 1.2s · TTI 0.8s ✓" },
    ],
  },
  {
    id: "ai",
    title: "IA Generativa",
    role: "AI Architect",
    tagline: "Sistemas RAG, agentes y pipelines multi-modelo con coste optimizado",
    accent: "#a78bfa",
    bgTint: "rgba(124,58,237,0.10)",
    spriteFile: "/sprites/ai-walk.png",
    capabilities: [
      "RAG con LlamaIndex / Langchain",
      "Multi-model routing inteligente",
      "Claude + GPT-4o + Gemini",
      "Vector embeddings + reranking",
    ],
    logs: [
      { type: "thinking", text: "Indexando base de conocimiento..." },
      { type: "executing", text: "llama-index ingest ./docs --embed ada-002" },
      { type: "thinking", text: "Evaluando estrategia de routing..." },
      { type: "executing", text: "router.register('claude-3-5', cost=0.003)" },
      { type: "executing", text: "rag.query('¿Cuál es la política de devoluciones?')" },
      { type: "thinking", text: "Verificando calidad de respuesta..." },
      { type: "executing", text: "eval.run(metric='faithfulness,relevance')" },
      { type: "notify", text: "Score 96% · Latencia 340ms · Coste -62% ✓" },
    ],
  },
  {
    id: "auto",
    title: "Automatización",
    role: "Automation Engineer",
    tagline: "Flujos end-to-end que eliminan horas de trabajo manual repetitivo",
    accent: "#fb923c",
    bgTint: "rgba(217,92,16,0.10)",
    spriteFile: "/sprites/auto-walk.png",
    capabilities: [
      "n8n + Make workflows",
      "Webhooks y APIs externas",
      "Email + Slack + Notion sync",
      "Pipelines de validación de datos",
    ],
    logs: [
      { type: "thinking", text: "Mapeando flujo de trabajo actual..." },
      { type: "executing", text: "n8n workflow create --name 'Lead-to-CRM'" },
      { type: "executing", text: "webhook.on('form.submitted', handleLead)" },
      { type: "thinking", text: "Detectando cuellos de botella..." },
      { type: "executing", text: "pipeline.run({ input: 'leads.csv', validate: true })" },
      { type: "executing", text: "slack.post('#ventas', 'Lead calificado: Ana M. ✓')" },
      { type: "executing", text: "crm.upsert({ email, score: 87, stage: 'qualified' })" },
      { type: "notify", text: "847 tareas procesadas · 0 errores · -3h/día ✓" },
    ],
  },
  {
    id: "agents",
    title: "Agentes Inteligentes",
    role: "Agent Specialist",
    tagline: "Agentes de voz y chat que trabajan 24/7 sin necesidad de supervisión",
    accent: "#34d399",
    bgTint: "rgba(10,144,104,0.10)",
    spriteFile: "/sprites/agent-walk.png",
    capabilities: [
      "VAPI + ElevenLabs voz",
      "CRM + Salesforce integrations",
      "Human-in-the-loop handoff",
      "Memory persistence entre sesiones",
    ],
    logs: [
      { type: "thinking", text: "Inicializando agente de atención..." },
      { type: "executing", text: "vapi.start({ voice: 'es-ES', model: 'gpt-4o' })" },
      { type: "executing", text: "memory.load('cliente_historial_2024')" },
      { type: "thinking", text: "Procesando intención del usuario..." },
      { type: "executing", text: "tools.call('check_order_status', { id: 'ORD-4821' })" },
      { type: "executing", text: "crm.update({ status: 'resolved', score: 9 })" },
      { type: "thinking", text: "Evaluando necesidad de handoff a humano..." },
      { type: "notify", text: "Sesión cerrada · CSAT 4.8/5 · Escalación: ninguna ✓" },
    ],
  },
];
