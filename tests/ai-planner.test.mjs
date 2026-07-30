import test from "node:test";
import assert from "node:assert/strict";
import { assemblePlan, createOpenAIRequest, extractOutputText, generateAIPlan } from "../ai-planner.mjs";
import { validateGenerateInput } from "../server.mjs";

const input = { projectName: "地域イベント", idea: "近所のイベントを検索する", audience: "子育て世帯", platform: "Webアプリ" };
const sections = {
  summary: "地域イベントを探せるサービスです。",
  userStories: "・利用者としてイベントを検索したい",
  screens: "1. 検索画面",
  data: "Event — イベント情報",
  api: "GET /api/events — 一覧取得",
  tasks: "P0 — 検索画面を実装",
  risks: "・掲載情報の鮮度"
};

test("creates a strict structured-output request", () => {
  const request = createOpenAIRequest(input);
  assert.equal(request.model, "gpt-5.6-sol");
  assert.equal(request.store, false);
  assert.equal(request.text.format.type, "json_schema");
  assert.equal(request.text.format.strict, true);
});

test("extracts and assembles a valid plan", () => {
  const text = extractOutputText({ output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(sections) }] }] });
  const plan = assemblePlan(input, JSON.parse(text));
  assert.equal(plan.projectName, input.projectName);
  assert.equal(plan.sections.api, sections.api);
});

test("calls Responses API without exposing the key in the body", async () => {
  let requestOptions;
  const plan = await generateAIPlan(input, {
    apiKey: "secret-test-key",
    fetchImpl: async (_url, options) => {
      requestOptions = options;
      return { ok: true, json: async () => ({ output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(sections) }] }] }) };
    }
  });
  assert.equal(requestOptions.headers.Authorization, "Bearer secret-test-key");
  assert.doesNotMatch(requestOptions.body, /secret-test-key/);
  assert.equal(plan.sections.summary, sections.summary);
});

test("validates API input boundaries", () => {
  assert.deepEqual(validateGenerateInput(input), []);
  assert.ok(validateGenerateInput({ ...input, idea: "" }).length > 0);
  assert.ok(validateGenerateInput({ ...input, platform: "unknown" }).length > 0);
});

