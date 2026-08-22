"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AnalysisFile = {
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
  files: AnalysisFile[];
};

export default function BugPredictionPage() {
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

  const bugRisk =
    analysis?.summary?.bugRisk ?? 0;

  const qualityScore =
    analysis?.summary?.qualityScore ?? 0;

  const files = analysis?.files ?? [];

  const riskFiles = files
    .map((file) => {
      const risk =
        file.functionCount * 5 +
        file.longLines * 10 +
        file.todoCount * 8 +
        file.consoleCount * 3;

      return {
        ...file,
        risk: Math.min(
          Math.max(risk, 0),
          100
        ),
      };
    })
    .sort(
      (a, b) => b.risk - a.risk
    );

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
            className="dashboard-nav-item active"
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
            className="dashboard-nav-item"
          >
            <span>◈</span>
            Technical Debt
          </button>

          <button
            className="dashboard-nav-item"
          >
            <span>⌕</span>
            Semantic Search
          </button>

          <button
            className="dashboard-nav-item"
          >
            <span>✦</span>
            AI Assistant
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="dashboard-nav-item"
          >
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
              Bug Prediction
            </p>

            <h1>
              Bug Prediction
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
              : "Prediction complete"}

            <span className="branch">
              {analysis?.branch ?? "main"}
            </span>

          </div>

        </div>

        {/* ERROR */}

        {error && (

          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "10px",
              background: "#fee2e2",
              color: "#991b1b",
            }}
          >
            {error}
          </div>

        )}

        {/* METRICS */}

        <section
          className="dashboard-section"
        >

          <div
            className="metrics-dashboard"
          >

            <DashboardMetric
              title="Bug Risk"
              value={
                loading
                  ? "..."
                  : String(bugRisk)
              }
              suffix="%"
              trend="Live"
              description={
                bugRisk < 20
                  ? "Low Risk"
                  : bugRisk < 50
                  ? "Medium Risk"
                  : "High Risk"
              }
            />

            <DashboardMetric
              title="Code Quality"
              value={
                loading
                  ? "..."
                  : String(qualityScore)
              }
              suffix="/100"
              trend="Live"
              description={
                analysis?.summary
                  ?.qualityLabel ??
                "Analyzing"
              }
            />

            <DashboardMetric
              title="Files"
              value={
                loading
                  ? "..."
                  : String(files.length)
              }
              suffix=""
              trend="Scanned"
              description="Source files"
            />

            <DashboardMetric
              title="Risky Files"
              value={
                loading
                  ? "..."
                  : String(
                      riskFiles.filter(
                        (file) =>
                          file.risk >= 40
                      ).length
                    )
              }
              suffix=""
              trend="Detected"
              description="Need attention"
            />

          </div>

        </section>

        {/* BUG RISK OVERVIEW */}

        <section
          className="dashboard-section"
        >

          <div
            className="dashboard-card"
          >

            <div className="card-header">

              <div>

                <h2>
                  Bug Risk Overview
                </h2>

                <p>
                  Estimated risk based on
                  code complexity and
                  detected code issues.
                </p>

              </div>

            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "30px",
                padding: "30px 10px",
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
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent:
                    "center",
                }}
              >

                <strong
                  style={{
                    fontSize: "36px",
                  }}
                >
                  {bugRisk}%
                </strong>

                <span>
                  Bug Risk
                </span>

              </div>

              <div>

                <h3>
                  {bugRisk < 20
                    ? "Low Risk"
                    : bugRisk < 50
                    ? "Moderate Risk"
                    : "High Risk"}
                </h3>

                <p>
                  {bugRisk < 20
                    ? "Your repository currently shows a low probability of bug-related issues."
                    : "Some parts of your repository require additional engineering attention."}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RISK FILES */}

        <section
          className="dashboard-section"
        >

          <div
            className="dashboard-card"
          >

            <div className="card-header">

              <div>

                <h2>
                  Files With Highest Bug Risk
                </h2>

                <p>
                  Files that may require
                  additional review.
                </p>

              </div>

            </div>

            <div className="risk-table">

              <div
                className="risk-table-header"
              >

                <span>
                  FILE
                </span>

                <span>
                  RISK
                </span>

                <span>
                  FUNCTIONS
                </span>

                <span>
                  ISSUES
                </span>

              </div>

              {loading ? (

                <div
                  className="risk-table-row"
                >

                  <span>
                    Analyzing...
                  </span>

                </div>

              ) : riskFiles.length === 0 ? (

                <div
                  className="risk-table-row"
                >

                  <span>
                    No files found
                  </span>

                </div>

              ) : (

                riskFiles.map(
                  (file) => {

                    const issues =
                      file.todoCount +
                      file.consoleCount +
                      file.longLines;

                    return (

                      <div
                        className="risk-table-row"
                        key={file.path}
                      >

                        <span
                          className="file-name"
                        >
                          {file.path}
                        </span>

                        <span
                          className={
                            file.risk >= 60
                              ? "risk-high"
                              : file.risk >= 30
                              ? "risk-medium"
                              : "risk-high"
                          }
                        >
                          {file.risk}%
                        </span>

                        <span>
                          {file.functionCount}
                        </span>

                        <span>
                          {issues}
                        </span>

                      </div>

                    );
                  }
                )

              )}

            </div>

          </div>

        </section>

        {/* RISK FACTORS */}

        <section
          className="dashboard-section"
        >

          <div
            className="dashboard-grid"
          >

            <RiskCard
              title="Function Complexity"
              value={
                files.reduce(
                  (sum, file) =>
                    sum +
                    file.functionCount,
                  0
                )
              }
              description="Total functions detected"
            />

            <RiskCard
              title="Long Lines"
              value={
                files.reduce(
                  (sum, file) =>
                    sum +
                    file.longLines,
                  0
                )
              }
              description="Lines exceeding 100 characters"
            />

            <RiskCard
              title="TODO / FIXME"
              value={
                analysis?.summary
                  ?.totalTodos ?? 0
              }
              description="Unresolved development markers"
            />

            <RiskCard
              title="Console Statements"
              value={
                analysis?.summary
                  ?.totalConsoleStatements ??
                0
              }
              description="Debugging statements detected"
            />

          </div>

        </section>

        {/* RECOMMENDATION */}

        <section
          className="dashboard-section"
        >

          <div
            className="dashboard-card"
          >

            <div className="card-header">

              <div>

                <h2>
                  Recommended Action
                </h2>

                <p>
                  Start reviewing the highest
                  risk files first.
                </p>

              </div>

            </div>

            <div
              style={{
                padding: "20px",
              }}
            >

              {riskFiles.length > 0 ? (

                <>

                  <h3>
                    Start with:
                  </h3>

                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                  >
                    {riskFiles[0].path}
                  </p>

                  <p>
                    This file currently has
                    the highest calculated
                    risk score of{" "}
                    <strong>
                      {riskFiles[0].risk}%
                    </strong>.
                  </p>

                </>

              ) : (

                <p>
                  No high-risk files detected.
                </p>

              )}

            </div>

          </div>

        </section>

      </section>

    </main>
  );
}

/* ================================================= */
/* METRIC */
/* ================================================= */

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

/* ================================================= */
/* RISK CARD */
/* ================================================= */

function RiskCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
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
          padding: "20px",
        }}
      >

        <strong
          style={{
            fontSize: "36px",
          }}
        >
          {value}
        </strong>

      </div>

    </div>
  );
}