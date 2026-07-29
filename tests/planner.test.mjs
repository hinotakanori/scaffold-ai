import test from "node:test";
import assert from "node:assert/strict";
import { generatePlan, planToMarkdown, safeFilename, sectionLabels } from "../planner.mjs";

test("generates every required plan section", () => {
  const plan = generatePlan({ projectName: "地域イベント", idea: "近所のイベントを探す", audience: "子育て世帯", platform: "web" });
  assert.equal(plan.projectName, "地域イベント");
  assert.deepEqual(Object.keys(plan.sections), Object.keys(sectionLabels));
  assert.match(plan.sections.summary, /子育て世帯/);
});

test("normalizes empty optional fields", () => {
  const plan = generatePlan({ projectName: "Test", idea: "Task", audience: "", platform: "unknown" });
  assert.match(plan.sections.summary, /想定する主要ユーザー/);
  assert.match(plan.sections.summary, /Webアプリ/);
});

test("exports a complete markdown document", () => {
  const plan = generatePlan({ projectName: "Plan", idea: "Build", audience: "Users", platform: "api" });
  const markdown = planToMarkdown(plan);
  assert.match(markdown, /^# Plan/);
  assert.match(markdown, /## Product summary/);
  assert.match(markdown, /## Risks & questions/);
});

test("creates safe export filenames", () => {
  assert.equal(safeFilename(" My Product! ", "json"), "my-product.json");
  assert.equal(safeFilename("", "md"), "scaffold-plan.md");
});
