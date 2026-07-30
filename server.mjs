import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { generateAIPlan } from "./ai-planner.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
await loadEnv(join(root, ".env"));
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

export function validateGenerateInput(input) {
  const errors = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) return ["入力が必要です"];
  if (!String(input.projectName ?? "").trim() || String(input.projectName).length > 80) errors.push("プロジェクト名を80文字以内で入力してください");
  if (!String(input.idea ?? "").trim() || String(input.idea).length > 1200) errors.push("サービス内容を1200文字以内で入力してください");
  if (String(input.audience ?? "").length > 120) errors.push("主な利用者は120文字以内で入力してください");
  if (!new Set(["Webアプリ", "モバイルアプリ", "社内ツール", "APIサービス"]).has(input.platform)) errors.push("提供形態が不正です");
  return errors;
}

async function loadEnv(path) {
  try {
    const content = await readFile(path, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].trim();
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 20_000) throw new Error("Request too large");
  }
  return JSON.parse(body || "{}");
}

function sendJson(response, status, value) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(value));
}

export const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    if (request.method === "POST" && url.pathname === "/api/generate") {
      const input = await readJson(request);
      const errors = validateGenerateInput(input);
      if (errors.length) return sendJson(response, 400, { error: errors.join("、") });
      const plan = await generateAIPlan(input, {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || "gpt-5.6-sol"
      });
      return sendJson(response, 200, { plan, source: "openai" });
    }

    if (request.method !== "GET" && request.method !== "HEAD") return sendJson(response, 405, { error: "Method not allowed" });
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = normalize(join(root, pathname));
    if (!filePath.startsWith(root)) return sendJson(response, 403, { error: "Forbidden" });
    const content = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    if (error.code === "ENOENT") return sendJson(response, 404, { error: "Not found" });
    console.error(error.message);
    sendJson(response, 500, { error: "AIプランの生成に失敗しました" });
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(port, "127.0.0.1", () => console.log(`Scaffold AI: http://localhost:${port}`));
}
