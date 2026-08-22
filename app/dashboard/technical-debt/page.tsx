"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FileData = {
  path: string;
  totalLines: number;
  codeLines: number;
  todoCount: number;
  consoleCount: number;
  longLines: number;
  functionCount: number;
};

type AnalysisData = {
  repository: string;
  branch: string;
  summary: {
    filesAnalyzed: number;
    totalLines: number;
    totalTodos: number;
    totalConsoleStatements: number;
    qualityScore: number;
    qualityLabel: string;
    bugRisk: number;
  };
  files: FileData[];
};

export default function TechnicalDebtPage() {
  const router = useRouter();

  const [analysis, setAnalysis] =
    useState<AnalysisData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadAnalysis() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/analyze/full?owner=Husnain224&repo=ai-code-intelligence",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Analysis failed"
        );
      }

      setAnalysis(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Analysis failed"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalysis();
  }, []);

  const files = analysis?.files ?? [];

  const totalLongLines = files.reduce(
    (sum, file) =>
      sum + file.longLines,
    0
  );

  const totalFunctions = files.reduce(
    (sum, file) =>
      sum + file.functionCount,
    0
  );

  const totalTodos =
    analysis?.summary?.totalTodos ?? 0;

  /*
   * Technical debt estimation.
   *
   * This is intentionally a simple
   * first version.
   */

  const debtPoints =
    totalLongLines +
    totalTodos * 3 +
    files.filter(
      (file) => file.codeLines > 300
    ).length *
      5;

  const debtHours = Math.max(
    1,
    Math.round(debtPoints * 0.5)
  );

  const debtLevel =
    debtHours <= 5
      ? "Low"
      : debtHours <= 15
      ? "Medium"
      : "High";

  const debtFiles = files
    .map((file) => {
      const score =
        file.longLines * 2 +
        file.todoCount * 5 +
        (file.codeLines > 300 ? 10 : 0) +
        (file.functionCount > 8 ? 10 : 0);

      return {
        ...file,
        debtScore: Math.min(
          score,
          100
        ),
      };
    })
    .sort(
      (a, b) =>
        b.debtScore -
        a.debtScore
    )
    .slice(0, 5);

  return (
    <main className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">

          <div className="logo-icon">
            AI
          </div>

          <span>
            Code Intelligence
          </span>

        </div>

        <nav className="dashboard-nav">

          <button
            className="dashboard-nav-item"
            onClick={() =>
              router.push("/dashboard")
            }
          >
            <span>▦</span>
            Overview
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              router.push(
                "/dashboard/analysis"
              )
            }
          >
            <span>⌘</span>
            Code Analysis
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              router.push(
                "/dashboard/security"
              )
            }
          >
            <span>◇</span>
            Security
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              router.push(
                "/dashboard/bugs"
              )
            }
          >
            <span>△</span>
            Bug Prediction
          </button>

          <button
            className="dashboard-nav-item active"
            onClick={() =>
              router.push(
                "/dashboard/technical-debt"
              )
            }
          >
            <span>◈</span>
            Technical Debt
          </button>

          <button className="dashboard-nav-item">
            <span>⌕</span>
            Semantic Search
          </button>

          <button className="dashboard-nav-item">
            <span>✦</span>
            AI Assistant
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button className="dashboard-nav-item">
            <span>⚙</span>
            Settings
          </button>

          <div className="user-card">

            <div className="user-avatar">
              HS
            </div>

            <div>

              <strong>
                Developer
              </strong>

              <span>
                Free Plan
              </span>

            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <section className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <p className="breadcrumb">
              Workspace / Repository /
              Technical Debt
            </p>

            <h1>
              Technical Debt
            </h1>

          </div>

          <div className="dashboard-actions">

            <button
              className="header-button"
              onClick={loadAnalysis}
              disabled={loading}
            >
              ↻{" "}
              {loading
                ? "Analyzing..."
                : "Re-analyze"}
            </button>

          </div>

        </header>

        {/* ERROR */}

        {error && (

          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "10px",
              background: "#fee2e2",
              color: "#991b1b",
            }}
          >
            {error}
          </div>

        )}

        {/* REPOSITORY */}

        <div className="repository-bar">

          <div className="repository-info">

            <div className="github-icon">
              GH
            </div>

            <div>

              <strong>
                ai-code-intelligence
              </strong>

              <span>
                Husnain224 /
                ai-code-intelligence
              </span>

            </div>

          </div>

          <div className="repository-status">

            <span className="online-dot"></span>

            {loading
              ? "Analyzing repository..."
              : "Analysis up to date"}

            <span className="branch">
              {analysis?.branch ??
                "main"}
            </span>

          </div>

        </div>

        {/* METRICS */}

        <section className="dashboard-section">

          <div className="metrics-dashboard">

            <DashboardMetric
              title="Technical Debt"
              value={
                loading
                  ? "..."
                  : String(debtHours)
              }
              suffix="h"
              trend="Estimated"
              description={debtLevel}
            />

            <DashboardMetric
              title="Long Lines"
              value={
                loading
                  ? "..."
                  : String(
                      totalLongLines
                    )
              }
              suffix=""
              trend="Detected"
              description="Review needed"
            />

            <DashboardMetric
              title="TODO Items"
              value={
                loading
                  ? "..."
                  : String(totalTodos)
              }
              suffix=""
              trend="Detected"
              description={
                totalTodos === 0
                  ? "Clean"
                  : "Unresolved"
              }
            />

            <DashboardMetric
              title="Functions"
              value={
                loading
                  ? "..."
                  : String(
                      totalFunctions
                    )
              }
              suffix=""
              trend="Analyzed"
              description="Code structure"
            />

          </div>

        </section>

        {/* DEBT OVERVIEW */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Technical Debt Overview
                </h2>

                <p>
                  Estimated effort required
                  to improve the current
                  codebase.
                </p>

              </div>

            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "35px",
                padding: "30px",
              }}
            >

              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  border:
                    "12px solid #e5e7eb",
                  display: "flex",
                  flexDirection:
                    "column",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                }}
              >

                <strong
                  style={{
                    fontSize: "36px",
                  }}
                >
                  {loading
                    ? "..."
                    : debtHours}
                </strong>

                <span>
                  hours
                </span>

              </div>

              <div>

                <h2>
                  {debtLevel} Technical Debt
                </h2>

                <p>
                  Based on code size,
                  unresolved TODO items,
                  long lines, and function
                  complexity.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* DEBT FILES */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Highest Technical Debt
                </h2>

                <p>
                  Files that may require
                  refactoring.
                </p>

              </div>

            </div>

            <div className="risk-table">

              <div className="risk-table-header">

                <span>
                  FILE
                </span>

                <span>
                  DEBT
                </span>

                <span>
                  LINES
                </span>

                <span>
                  FUNCTIONS
                </span>

              </div>

              {loading ? (

                <div className="risk-table-row">

                  <span>
                    Analyzing files...
                  </span>

                </div>

              ) : debtFiles.length === 0 ? (

                <div className="risk-table-row">

                  <span>
                    No technical debt
                    detected.
                  </span>

                </div>

              ) : (

                debtFiles.map(
                  (file) => (

                    <div
                      className="risk-table-row"
                      key={file.path}
                    >

                      <span className="file-name">
                        {file.path}
                      </span>

                      <span
                        className={
                          file.debtScore >= 70
                            ? "risk-high"
                            : "risk-medium"
                        }
                      >
                        {file.debtScore}
                      </span>

                      <span>
                        {file.codeLines}
                      </span>

                      <span>
                        {file.functionCount}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>

        {/* RECOMMENDATIONS */}

        <section className="dashboard-section">

          <div className="dashboard-grid">

            <RecommendationCard
              title="Refactor Large Files"
              description="Break large files into smaller, focused modules."
              count={
                files.filter(
                  (file) =>
                    file.codeLines >
                    300
                ).length
              }
            />

            <RecommendationCard
              title="Resolve TODO Items"
              description="Complete unfinished implementation markers."
              count={totalTodos}
            />

            <RecommendationCard
              title="Improve Readability"
              description="Reduce unusually long lines and simplify complex code."
              count={totalLongLines}
            />

          </div>

        </section>

        {/* ACTIONS */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Recommended Actions
                </h2>

                <p>
                  Steps to reduce technical
                  debt.
                </p>

              </div>

            </div>

            <div
              style={{
                padding:
                  "20px 25px",
              }}
            >

              <ul
                style={{
                  lineHeight: "2",
                  paddingLeft:
                    "20px",
                }}
              >

                <li>
                  Refactor files with high
                  debt scores.
                </li>

                <li>
                  Break large functions into
                  smaller functions.
                </li>

                <li>
                  Resolve TODO and FIXME
                  items.
                </li>

                <li>
                  Reduce unnecessarily long
                  lines.
                </li>

                <li>
                  Add automated quality checks
                  to your CI/CD pipeline.
                </li>

              </ul>

            </div>

          </div>

        </section>

      </section>

    </main>
  );
}

/* METRIC */

function DashboardMetric({
  title,
  value,
  suffix,
  trend,
  description,
}: {
  title: string;
  value: string;
  suffix: string;
  trend: string;
  description: string;
}) {
  return (
    <div className="dashboard-metric">

      <div className="metric-title">

        <span>
          {title}
        </span>

        <span className="metric-menu">
          •••
        </span>

      </div>

      <div className="metric-value">

        <strong>
          {value}
        </strong>

        <span>
          {suffix}
        </span>

      </div>

      <div className="metric-bottom">

        <span className="metric-trend">
          {trend}
        </span>

        <span>
          {description}
        </span>

      </div>

    </div>
  );
}

/* RECOMMENDATION */

function RecommendationCard({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count: number;
}) {
  return (
    <div className="dashboard-card">

      <div className="card-header">

        <div>

          <h2>
            {title}
          </h2>

          <p>
            {description}
          </p>

        </div>

      </div>

      <div
        style={{
          padding: "20px 25px",
        }}
      >

        <strong
          style={{
            fontSize: "34px",
          }}
        >
          {count}
        </strong>

        <p>
          Items detected
        </p>

      </div>

    </div>
  );
}
