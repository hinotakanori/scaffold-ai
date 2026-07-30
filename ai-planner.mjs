import { validatePlan } from "./planner.mjs";

const sectionsSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "userStories", "screens", "data", "api", "tasks", "risks"],
  properties: {
    summary: { type: "string", minLength: 1 },
    userStories: { type: "string", minLength: 1 },
    screens: { type: "string", minLength: 1 },
    data: { type: "string", minLength: 1 },
    api: { type: "string", minLength: 1 },
    tasks: { type: "string", minLength: 1 },
    risks: { type: "string", minLength: 1 }
  }
};

export function createOpenAIRequest(input, model = "gpt-5.6-sol") {
  return {
    model,
    store: false,
    reasoning: { effort: "low" },
    instructions: [
      "あなたは経験豊富なプロダクトマネージャー兼ソフトウェアアーキテクトです。",
      "曖昧なアイデアを、MVPとして実装・検証できる具体的な開発計画へ変換してください。",
      "現実的な前提を置き、各セクションは日本語で簡潔かつ具体的に書いてください。",
      "User stories、Screens、Data model、API outline、Prioritized tasks、Risks & questionsは改行区切りで読みやすくしてください。",
      "成功条件は、開発者が追加説明なしで最初の実装に着手できることです。"
    ].join("\n"),
    input: JSON.stringify({
      projectName: input.projectName,
      idea: input.idea,
      audience: input.audience,
      platform: input.platform
    }),
    text: {
      verbosity: "medium",
      format: {
        type: "json_schema",
        name: "scaffold_ai_plan_sections",
        schema: sectionsSchema,
        strict: true
      }
    }
  };
}

export function extractOutputText(response) {
  for (const item of response?.output ?? []) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text) return content.text;
      if (content.type === "refusal") throw new Error("The model refused this request");
    }
  }
  throw new Error("OpenAI returned no plan output");
}

export function assemblePlan(input, sections) {
  const plan = {
    schemaVersion: "1.0",
    projectName: input.projectName.trim(),
    createdAt: new Date().toISOString(),
    input: {
      idea: input.idea.trim(),
      audience: input.audience.trim() || "想定する主要ユーザー",
      platform: input.platform
    },
    sections
  };
  const validation = validatePlan(plan);
  if (!validation.valid) throw new Error(`Invalid AI plan: ${validation.errors.join(", ")}`);
  return plan;
}

export async function generateAIPlan(input, { apiKey, model, fetchImpl = fetch } = {}) {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const response = await fetchImpl("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createOpenAIRequest(input, model))
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || `OpenAI API error (${response.status})`);
  return assemblePlan(input, JSON.parse(extractOutputText(payload)));
}

