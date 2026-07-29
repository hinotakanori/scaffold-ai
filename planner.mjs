export const sectionLabels = {
  summary: "Product summary",
  userStories: "User stories",
  screens: "Screens",
  data: "Data model",
  api: "API outline",
  tasks: "Prioritized tasks",
  risks: "Risks & questions"
};

const platformNames = { web: "Webアプリ", mobile: "モバイルアプリ", internal: "社内ツール", api: "APIサービス" };

function clean(value, fallback) {
  const normalized = String(value ?? "").trim().replace(/\s+/g, " ");
  return normalized || fallback;
}

export function generatePlan(input) {
  const name = clean(input.projectName, "名称未定のプロジェクト");
  const idea = clean(input.idea, "ユーザーの課題を解決するサービス");
  const audience = clean(input.audience, "想定する主要ユーザー");
  const platform = platformNames[input.platform] || platformNames.web;

  return {
    schemaVersion: "1.0",
    projectName: name,
    createdAt: new Date().toISOString(),
    input: { idea, audience, platform },
    sections: {
      summary: `${name}は、${audience}向けの${platform}です。${idea}。最初のリリースでは、価値の中心となる1つの利用フローを短時間で完了できることを目指します。`,
      userStories: `・${audience}として、迷わずサービスを始めたい\n・${audience}として、必要な情報を登録・確認・更新したい\n・${audience}として、結果を保存または共有したい`,
      screens: `1. ランディング／開始画面\n2. 入力・作成画面\n3. 結果・詳細画面\n4. 保存済み項目の一覧画面\n5. 設定・ヘルプ画面`,
      data: `User — 利用者情報（MVPでは匿名利用も検討）\nProject — 作成対象の基本情報\nRecord — Projectに紐づく入力・結果\nRevision — 編集履歴と更新日時`,
      api: `POST /api/projects — プロジェクト作成\nGET /api/projects/:id — 詳細取得\nPATCH /api/projects/:id — 内容更新\nPOST /api/projects/:id/generate — 結果生成\nGET /api/projects/:id/export — 書き出し`,
      tasks: `P0 — 主要フローの画面プロトタイプ\nP0 — 入力検証と構造化データ定義\nP0 — 作成・編集・保存機能\nP1 — Markdown／JSONエクスポート\nP1 — エラー処理と自動テスト\nP2 — 認証、共有、利用分析`,
      risks: `・中心となる利用価値を1文で説明できるか\n・最初のユーザーは誰で、どこで獲得するか\n・保存する個人情報を最小化できるか\n・生成結果の正しさを誰がどの基準で確認するか`
    }
  };
}

export function planToMarkdown(plan) {
  const lines = [`# ${plan.projectName}`, "", `Generated: ${plan.createdAt}`, ""];
  for (const [key, label] of Object.entries(sectionLabels)) {
    lines.push(`## ${label}`, "", plan.sections[key] || "", "");
  }
  return lines.join("\n").trimEnd() + "\n";
}

export function safeFilename(name, extension) {
  const base = clean(name, "scaffold-plan").toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "scaffold-plan";
  return `${base}.${extension}`;
}
