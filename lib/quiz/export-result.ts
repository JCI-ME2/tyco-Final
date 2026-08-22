import type { QuizParticipant } from "@/lib/quiz/types";

// Brand palette (hex approximations of the site's oklch tokens) so the
// exported PDF matches the website's colors and Johnson Controls branding.
const COLORS = {
  brand: "#14235f",
  accent: "#1f74c7",
  green: "#1f9d57",
  red: "#c0392b",
  text: "#1f2937",
  muted: "#6b7280",
  border: "#e5e7eb",
  soft: "#f3f5f9",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function exportQuizResultPdf(opts: {
  participant: QuizParticipant;
  quizTitle: string;
  score: number;
  total: number;
}) {
  const { participant, quizTitle, score, total } = opts;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const pass = pct >= 70;
  const resultColor = pass ? COLORS.green : COLORS.red;
  const resultLabel = pass ? "Passed" : "Not passed";
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const logo = `${window.location.origin}/images/jci-logo.png`;

  const win = window.open("", "_blank", "width=900,height=1000");
  if (!win) {
    alert("Please allow pop-ups for this site to export your results as a PDF.");
    return;
  }

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(quizTitle)} - Results - ${escapeHtml(participant.fullName)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #ffffff; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: ${COLORS.text};
    padding: 32px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet {
    max-width: 720px;
    margin: 0 auto;
    border: 1px solid ${COLORS.border};
    border-radius: 14px;
    overflow: hidden;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 14px;
    background: ${COLORS.brand};
    padding: 22px 28px;
  }
  .header img { width: 44px; height: 44px; object-fit: contain; background: #fff; border-radius: 6px; padding: 4px; }
  .header h1 { color: #fff; font-size: 19px; line-height: 1.2; }
  .header p { color: rgba(255,255,255,0.72); font-size: 12px; margin-top: 2px; }
  .accent-bar { height: 4px; background: linear-gradient(90deg, ${COLORS.accent}, ${COLORS.green}, ${COLORS.accent}); }
  .body { padding: 28px; }
  .title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: ${COLORS.muted}; }
  .subtitle { font-size: 22px; font-weight: 700; color: ${COLORS.brand}; margin-top: 4px; }
  .info { margin-top: 24px; border: 1px solid ${COLORS.border}; border-radius: 10px; overflow: hidden; }
  .info-row { display: flex; border-bottom: 1px solid ${COLORS.border}; }
  .info-row:last-child { border-bottom: none; }
  .info-label { width: 42%; padding: 12px 16px; background: ${COLORS.soft}; font-size: 13px; font-weight: 600; color: ${COLORS.muted}; }
  .info-value { flex: 1; padding: 12px 16px; font-size: 14px; font-weight: 600; color: ${COLORS.text}; }
  .score-wrap { margin-top: 24px; display: flex; gap: 16px; }
  .score-card { flex: 1; text-align: center; border: 1px solid ${COLORS.border}; border-radius: 10px; padding: 18px 12px; background: ${COLORS.soft}; }
  .score-card .k { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: ${COLORS.muted}; }
  .score-card .v { font-size: 26px; font-weight: 800; color: ${COLORS.brand}; margin-top: 6px; }
  .badge { display: inline-block; margin-top: 6px; font-size: 22px; font-weight: 800; color: ${resultColor}; }
  .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid ${COLORS.border}; font-size: 11px; color: ${COLORS.muted}; text-align: center; }
  @media print { body { padding: 0; } .sheet { border: none; } }
</style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <img src="${logo}" alt="Johnson Controls" />
      <div>
        <h1>Johnson Controls</h1>
        <p>Product Knowledge Assessment</p>
      </div>
    </div>
    <div class="accent-bar"></div>
    <div class="body">
      <div class="title">Quiz Results</div>
      <div class="subtitle">${escapeHtml(quizTitle)}</div>

      <div class="info">
        <div class="info-row"><div class="info-label">Full name</div><div class="info-value">${escapeHtml(participant.fullName)}</div></div>
        <div class="info-row"><div class="info-label">Company</div><div class="info-value">${escapeHtml(participant.company)}</div></div>
        <div class="info-row"><div class="info-label">Date</div><div class="info-value">${escapeHtml(date)}</div></div>
      </div>

      <div class="score-wrap">
        <div class="score-card"><div class="k">Score</div><div class="v">${score} / ${total}</div></div>
        <div class="score-card"><div class="k">Percentage</div><div class="v">${pct}%</div></div>
        <div class="score-card"><div class="k">Result</div><div class="badge">${resultLabel}</div></div>
      </div>

      <div class="footer">
        Generated on ${escapeHtml(date)} &middot; Johnson Controls product training portal
      </div>
    </div>
  </div>
  <script>
    window.onload = function () {
      setTimeout(function () { window.focus(); window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
