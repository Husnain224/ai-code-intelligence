
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DebtFile = {
  path: string;
  debtScore: number;
  estimatedHours: number;
  totalLines: number;
  longLines: number;
  functions: number;
  todos: number;
  consoleStatements: number;
};

type DebtData = {
  repository: string;
  branch: string;

  summary: {
    debtScore: number;
    debtLabel: string;
    estimatedHours: number;
    filesAnalyzed: number;
    totalLines: number;
    totalTodos: number;
    totalConsoleStatements: number;
  };

  categories: {
    todos: {
      count: number;
      estimatedHours: number;
    };

    consoleStatements: {
      count: number;
      estimatedHours: number;
    };

    longLines: {
      count: number;
      estimatedHours: number;
    };

    complexity: {
      estimatedHours: number;
    };

    largeFiles: {
      count: number;
      estimatedHours: number;
    };
  };

  highDebtFiles: DebtFile[];

  recommendations: string[];

  methodology: {
    description: string;
    metrics: string[];
    note: string;
  };
};

export default function TechnicalDebtPage() {
  const router = useRouter();

  const [data, setData] =
    useState<DebtData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDebtAnalysis() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/debt",
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Technical debt analysis failed"
        );
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Technical debt analysis failed"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDebtAnalysis();
  }, []);

  const summary = data?.summary;

  function getScoreClass(
    score: number
  ) {
    if (score < 40) {
      return "debt-low";
    }

    if (score < 60) {
      return "debt-medium";
    }

    if (score < 80) {
      return "debt-high";
    }

    return "debt-critical";
  }

  function getScoreWidth(
    score: number
  ) {
    return `${Math.min(
      Math.max(score, 0),
      100
    )}%`;
  }

  return (
    <main className="dashboard-page">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

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

          <NavItem
            icon="▦"
            label="Overview"
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
          />

          <NavItem
            icon="⌘"
            label="Code Analysis"
            onClick={() =>
              router.push(
                "/dashboard/analysis"
              )
            }
          />

          <NavItem
            icon="◇"
            label="Security"
            onClick={() =>
              router.push(
                "/dashboard/security"
              )
            }
          />

          <NavItem
            icon="△"
            label="Bug Prediction"
            onClick={() =>
              router.push(
                "/dashboard/bugs"
              )
            }
          />

          <NavItem
            icon="◈"
            label="Technical Debt"
            active
            onClick={() =>
              router.push(
                "/dashboard/debt"
              )
            }
          />

          <NavItem
            icon="⌕"
            label="Semantic Search"
            onClick={() =>
              router.push(
                "/dashboard/search"
              )
            }
          />

          <NavItem
            icon="✦"
            label="AI Assistant"
            onClick={() =>
              router.push(
                "/dashboard/assistant"
              )
            }
          />

        </nav>

        <div className="sidebar-bottom">

          <NavItem
            icon="⚙"
            label="Settings"
            onClick={() =>
              router.push(
                "/dashboard/settings"
              )
            }
          />

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

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <section className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="breadcrumb">
              Workspace / Technical Debt
            </p>

            <h1>
              Technical Debt
            </h1>

          </div>

          <div className="dashboard-actions">

            <button
              className="header-button"
              onClick={
                loadDebtAnalysis
              }
              disabled={loading}
            >
              ↻{" "}
              {loading
                ? "Analyzing..."
                : "Refresh Analysis"}
            </button>

            <button
              className="primary-small"
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
            >
              ← Overview
            </button>

          </div>

        </header>

        {/* ERROR */}

        {error && (
          <div
            style={{
              padding: "14px 18px",
              marginBottom: "20px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "10px",
            }}
          >
            <strong>
              Technical Debt Error
            </strong>

            <div>
              {error}
            </div>
          </div>
        )}

        {/* REPOSITORY BAR */}

        <div className="repository-bar">

          <div className="repository-info">

            <div className="github-icon">
              GH
            </div>

            <div>

              <strong>
                {data?.repository ||
                  "ai-code-intelligence"}
              </strong>

              <span>
                {data?.repository ||
                  "Husnain224 / ai-code-intelligence"}
              </span>

            </div>

          </div>

          <div className="repository-status">

            <span className="online-dot" />

            {loading
              ? "Calculating technical debt..."
              : "Analysis up to date"}

            <span className="branch">
              {data?.branch ||
                "main"}
            </span>

          </div>

        </div>

        {/* ================================================= */}
        {/* TOP METRICS */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="metrics-dashboard">

            <div className="dashboard-metric">

              <div className="metric-title">

                <span>
                  Debt Score
                </span>

                <span className="metric-menu">
                  •••
                </span>

              </div>

              <div className="metric-value">

                <strong>
                  {loading
                    ? "..."
                    : summary?.debtScore ??
                      0}
                </strong>

                <span>
                  /100
                </span>

              </div>

              <div className="metric-bottom">

                <span
                  className={`metric-trend ${
                    summary
                      ? getScoreClass(
                          summary.debtScore
                        )
                      : ""
                  }`}
                >
                  {loading
                    ? "Analyzing"
                    : summary?.debtLabel}
                </span>

                <span>
                  Technical debt
                </span>

              </div>

            </div>

            <div className="dashboard-metric">

              <div className="metric-title">

                <span>
                  Estimated Debt
                </span>

                <span className="metric-menu">
                  •••
                </span>

              </div>

              <div className="metric-value">

                <strong>
                  {loading
                    ? "..."
                    : summary?.estimatedHours ??
                      0}
                </strong>

                <span>
                  hours
                </span>

              </div>

              <div className="metric-bottom">

                <span className="metric-trend">
                  Estimated
                </span>

                <span>
                  Remediation effort
                </span>

              </div>

            </div>

            <div className="dashboard-metric">

              <div className="metric-title">

                <span>
                  Files Analyzed
                </span>

                <span className="metric-menu">
                  •••
                </span>

              </div>

              <div className="metric-value">

                <strong>
                  {loading
                    ? "..."
                    : summary?.filesAnalyzed ??
                      0}
                </strong>

                <span>
                  files
                </span>

              </div>

              <div className="metric-bottom">

                <span className="metric-trend">
                  Live
                </span>

                <span>
                  Repository
                </span>

              </div>

            </div>

            <div className="dashboard-metric">

              <div className="metric-title">

                <span>
                  Total Lines
                </span>

                <span className="metric-menu">
                  •••
                </span>

              </div>

              <div className="metric-value">

                <strong>
                  {loading
                    ? "..."
                    : (
                        summary?.totalLines ??
                        0
                      ).toLocaleString()}
                </strong>

                <span>
                  LOC
                </span>

              </div>

              <div className="metric-bottom">

                <span className="metric-trend">
                  Source
                </span>

                <span>
                  Code analyzed
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* DEBT SCORE */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Technical Debt Health
                </h2>

                <p>
                  Overall technical debt
                  calculated from repository
                  code-quality indicators.
                </p>

              </div>

              <span
                className={`debt-status ${
                  summary
                    ? getScoreClass(
                        summary.debtScore
                      )
                    : ""
                }`}
              >
                {loading
                  ? "Analyzing"
                  : summary?.debtLabel}
              </span>

            </div>

            <div
              style={{
                marginTop: "25px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: "8px",
                }}
              >

                <span>
                  Debt Score
                </span>

                <strong>
                  {loading
                    ? "..."
                    : `${summary?.debtScore ?? 0}/100`}
                </strong>

              </div>

              <div
                style={{
                  width: "100%",
                  height: "14px",
                  background:
                    "#e5e7eb",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >

                <div
                  style={{
                    height: "100%",
                    width: loading
                      ? "0%"
                      : getScoreWidth(
                          summary?.debtScore ??
                            0
                        ),
                    background:
                      "linear-gradient(90deg, #22c55e, #eab308, #ef4444)",
                    borderRadius:
                      "999px",
                    transition:
                      "width 0.5s ease",
                  }}
                />

              </div>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* DEBT CATEGORIES */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="section-title-row">

            <div>

              <h2>
                Debt Categories
              </h2>

              <p>
                Where technical debt is
                coming from.
              </p>

            </div>

          </div>

          <div className="dashboard-grid">

            <DebtCategory
              title="TODO / FIXME"
              count={
                data?.categories.todos.count ??
                0
              }
              hours={
                data?.categories.todos
                  .estimatedHours ??
                0
              }
              icon="✓"
              loading={loading}
            />

            <DebtCategory
              title="Long Lines"
              count={
                data?.categories.longLines
                  .count ?? 0
              }
              hours={
                data?.categories.longLines
                  .estimatedHours ?? 0
              }
              icon="≡"
              loading={loading}
            />

            <DebtCategory
              title="Complexity"
              count={0}
              hours={
                data?.categories.complexity
                  .estimatedHours ?? 0
              }
              icon="◇"
              loading={loading}
            />

            <DebtCategory
              title="Large Files"
              count={
                data?.categories.largeFiles
                  .count ?? 0
              }
              hours={
                data?.categories.largeFiles
                  .estimatedHours ?? 0
              }
              icon="#"
              loading={loading}
            />

          </div>

        </section>

        {/* ================================================= */}
        {/* HIGH DEBT FILES */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Highest Technical Debt Files
                </h2>

                <p>
                  Files that should be reviewed
                  first.
                </p>

              </div>

              <button
                className="text-button"
                onClick={() =>
                  router.push(
                    "/dashboard/analysis"
                  )
                }
              >
                Code Analysis →
              </button>

            </div>

            <div
              className="risk-table"
              style={{
                marginTop: "20px",
              }}
            >

              <div className="risk-table-header">

                <span>
                  FILE
                </span>

                <span>
                  DEBT
                </span>

                <span>
                  HOURS
                </span>

                <span>
                  ISSUES
                </span>

              </div>

              {loading ? (

                <div className="risk-table-row">

                  <span>
                    Analyzing...
                  </span>

                  <span>
                    ...
                  </span>

                  <span>
                    ...
                  </span>

                  <span>
                    ...
                  </span>

                </div>

              ) : !data ||
                data.highDebtFiles.length ===
                  0 ? (

                <div className="risk-table-row">

                  <span>
                    No technical debt found.
                  </span>

                </div>

              ) : (

                data.highDebtFiles.map(
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
                          file.debtScore >=
                          80
                            ? "risk-high"
                            : "risk-medium"
                        }
                      >
                        {file.debtScore}%
                      </span>

                      <span>
                        {file.estimatedHours}
                        h
                      </span>

                      <span>
                        {file.todos +
                          file.longLines +
                          file.consoleStatements}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* RECOMMENDATIONS */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Recommended Actions
                </h2>

                <p>
                  Suggested steps to reduce
                  technical debt.
                </p>

              </div>

            </div>

            <div
              className="activity-list"
              style={{
                marginTop: "20px",
              }}
            >

              {loading ? (

                <div className="activity-item">

                  <div className="activity-icon">
                    ...
                  </div>

                  <div className="activity-content">

                    <strong>
                      Analyzing repository
                    </strong>

                    <span>
                      Generating recommendations...
                    </span>

                  </div>

                </div>

              ) : (

                data?.recommendations.map(
                  (recommendation, index) => (

                    <div
                      className="activity-item"
                      key={index}
                    >

                      <div className="activity-icon">
                        {index + 1}
                      </div>

                      <div className="activity-content">

                        <strong>
                          Recommendation{" "}
                          {index + 1}
                        </strong>

                        <span>
                          {recommendation}
                        </span>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* METHODOLOGY */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  How Technical Debt Is
                  Calculated
                </h2>

                <p>
                  Transparent static-analysis
                  methodology.
                </p>

              </div>

            </div>

            <p
              style={{
                marginTop: "18px",
                lineHeight: 1.7,
              }}
            >
              {data?.methodology.description ||
                "Technical debt is estimated using static repository metrics."}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "18px",
              }}
            >

              {(
                data?.methodology.metrics || [
                  "Long lines",
                  "Function count",
                  "TODO/FIXME comments",
                  "Console statements",
                  "Large files",
                ]
              ).map(
                (metric) => (

                  <span
                    key={metric}
                    style={{
                      padding:
                        "8px 12px",
                      borderRadius:
                        "999px",
                      background:
                        "#f3f4f6",
                      fontSize:
                        "13px",
                    }}
                  >
                    {metric}
                  </span>

                )
              )}

            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "14px 16px",
                background: "#f9fafb",
                borderRadius: "10px",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              <strong>
                Note:
              </strong>{" "}
              {data?.methodology.note ||
                "Estimated hours are heuristic engineering estimates."}
            </div>

          </div>

        </section>

      </section>

    </main>
  );
}

/* ================================================= */
/* NAVIGATION ITEM */
/* ================================================= */

function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`dashboard-nav-item ${
        active ? "active" : ""
      }`}
    >

      <span>
        {icon}
      </span>

      {label}

    </button>
  );
}

/* ================================================= */
/* DEBT CATEGORY */
/* ================================================= */

function DebtCategory({
  title,
  count,
  hours,
  icon,
  loading,
}: {
  title: string;
  count: number;
  hours: number;
  icon: string;
  loading: boolean;
}) {
  return (
    <div className="dashboard-card">

      <div className="activity-item">

        <div className="activity-icon">
          {icon}
        </div>

        <div className="activity-content">

          <strong>
            {title}
          </strong>

          <span>
            {loading
              ? "Analyzing..."
              : `${count} issues`}
          </span>

        </div>

      </div>

      <div
        style={{
          marginTop: "18px",
          fontSize: "24px",
          fontWeight: 700,
        }}
      >
        {loading
          ? "..."
          : `${hours}h`}
      </div>

      <div
        style={{
          marginTop: "4px",
          fontSize: "13px",
          opacity: 0.7,
        }}
      >
        Estimated remediation time
      </div>

    </div>
  );
}
