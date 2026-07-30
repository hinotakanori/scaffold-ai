import { generatePlan, planToMarkdown, safeFilename, sectionLabels, validatePlan } from "./planner.mjs";

const form = document.querySelector("#idea-form");
const idea = document.querySelector("#idea");
const counter = document.querySelector("#idea-count");
const emptyState = document.querySelector("#empty-state");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultSections = document.querySelector("#result-sections");
const feedback = document.querySelector("#feedback");
let currentPlan = null;

idea.addEventListener("input", () => { counter.textContent = `${idea.value.length} / 1200`; });

form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const values = Object.fromEntries(new FormData(form));
    currentPlan = generatePlan(values);
    renderPlan();
  } catch {
    feedback.textContent = "プランを生成できませんでした。入力内容を確認してください。";
  }
});

function renderPlan() {
  emptyState.hidden = true;
  result.hidden = false;
  resultTitle.textContent = currentPlan.projectName;
  resultSections.replaceChildren();
  for (const [key, label] of Object.entries(sectionLabels)) {
    const section = document.createElement("section");
    section.className = "plan-section";
    const heading = document.createElement("h3");
    heading.textContent = label;
    const body = document.createElement("div");
    body.className = "editable";
    body.contentEditable = "true";
    body.dataset.key = key;
    body.textContent = currentPlan.sections[key];
    body.addEventListener("input", () => { currentPlan.sections[key] = body.innerText.trim(); });
    section.append(heading, body);
    resultSections.append(section);
  }
  feedback.textContent = "プランを生成しました。各項目は直接編集できます。";
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelector("#reset-button").addEventListener("click", () => {
  currentPlan = null;
  form.reset();
  counter.textContent = "0 / 1200";
  result.hidden = true;
  emptyState.hidden = false;
  feedback.textContent = "";
});

document.querySelector("#save-button").addEventListener("click", () => {
  if (!currentPlan) return;
  localStorage.setItem("scaffold-ai:last-plan", JSON.stringify(currentPlan));
  feedback.textContent = "このブラウザに保存しました。";
});

document.querySelector("#markdown-button").addEventListener("click", () => {
  if (currentPlan) download(planToMarkdown(currentPlan), safeFilename(currentPlan.projectName, "md"), "text/markdown");
});

document.querySelector("#json-button").addEventListener("click", () => {
  if (currentPlan) download(JSON.stringify(currentPlan, null, 2), safeFilename(currentPlan.projectName, "json"), "application/json");
});

function download(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
  feedback.textContent = `${filename} を書き出しました。`;
}

try {
  const saved = JSON.parse(localStorage.getItem("scaffold-ai:last-plan"));
  if (validatePlan(saved).valid) {
    currentPlan = saved;
    renderPlan();
    feedback.textContent = "前回保存したプランを復元しました。";
  }
} catch {
  localStorage.removeItem("scaffold-ai:last-plan");
}
