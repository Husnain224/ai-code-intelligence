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

export default function CodeAnalysisPage() {
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

  const summary = analysis?.summary;

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
            className="dashboard-nav-item active"
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

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="breadcrumb">
              Workspace / Repository /
              Code Analysis
            </p>

            <h1>
              Code Analysis
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

        {/* REPOSITORY BAR */}

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
              : "Analysis complete"}

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
            <strong>
              Analysis Error
            </strong>

            <div>
              {error}
            </div>
          </div>

        )}

        {/* LOADING */}

        {loading && !analysis && (

          <div
            className="dashboard-card"
            style={{
              marginTop: "24px",
              textAlign: "center",
              padding: "50px",
            }}
          >

            <h2>
              Analyzing Repository
            </h2>

            <p>
              Reading source files from
              GitHub...
            </p>

          </div>

        )}

        {/* RESULTS */}

        {analysis && (

          <>

            {/* SUMMARY */}

            <section
              className="dashboard-section"
            >

              <div
                className="metrics-dashboard"
              >

                <DashboardMetric
                  title="Code Quality"
                  value={String(
                    summary?.qualityScore ?? 0
                  )}
                  suffix="/100"
                  trend="Live"
                  description={
                    summary?.qualityLabel ??
                    "Unknown"
                  }
                />

                <DashboardMetric
                  title="Bug Risk"
                  value={String(
                    summary?.bugRisk ?? 0
                  )}
                  suffix="%"
                  trend="Live"
                  description={
                    (summary?.bugRisk ?? 0) < 20
                      ? "Low Risk"
                      : "Needs Attention"
                  }
                />

                <DashboardMetric
                  title="Files"
                  value={String(
                    summary?.filesAnalyzed ?? 0
                  )}
                  suffix=""
                  trend="Analyzed"
                  description="Source files"
                />

                <DashboardMetric
                  title="Lines"
                  value={String(
                    summary?.totalLines ?? 0
                  )}
                  suffix=""
                  trend="Analyzed"
                  description="Total lines"
                />

              </div>

            </section>

            {/* QUALITY OVERVIEW */}

            <section
              className="dashboard-section"
            >

              <div
                className="dashboard-card"
              >

                <div className="card-header">

                  <div>

                    <h2>
                      Analysis Overview
                    </h2>

                    <p>
                      Overall code quality
                      measurements from your
                      repository.
                    </p>

                  </div>

                </div>

                <div
                  className="activity-list"
                >

                  <div
                    className="activity-item"
                  >

                    <div className="activity-icon">
                      ✓
                    </div>

                    <div className="activity-content">

                      <strong>
                        Quality Score
                      </strong>

                      <span>
                        {summary?.qualityScore}
                        /100 —{" "}
                        {summary?.qualityLabel}
                      </span>

                    </div>

                  </div>

                  <div
                    className="activity-item"
                  >

                    <div className="activity-icon">
                      !
                    </div>

                    <div className="activity-content">

                      <strong>
                        Bug Risk
                      </strong>

                      <span>
                        {summary?.bugRisk}%
                      </span>

                    </div>

                  </div>

                  <div
                    className="activity-item"
                  >

                    <div className="activity-icon">
                      #
                    </div>

                    <div className="activity-content">

                      <strong>
                        TODO / FIXME
                      </strong>

                      <span>
                        {summary?.totalTodos}
                      </span>

                    </div>

                  </div>

                  <div
                    className="activity-item"
                  >

                    <div className="activity-icon">
                      $
                    </div>

                    <div className="activity-content">

                      <strong>
                        Console Statements
                      </strong>

                      <span>
                        {
                          summary?.totalConsoleStatements
                        }
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* FILE ANALYSIS */}

            <section
              className="dashboard-section"
            >

              <div
                className="dashboard-card"
              >

                <div className="card-header">

                  <div>

                    <h2>
                      File Analysis
                    </h2>

                    <p>
                      Detailed analysis of
                      source files.
                    </p>

                  </div>

                  <span>
                    {analysis.files.length} files
                  </span>

                </div>

                <div className="risk-table">

                  <div className="risk-table-header">

                    <span>
                      FILE
                    </span>

                    <span>
                      LINES
                    </span>

                    <span>
                      FUNCTIONS
                    </span>

                    <span>
                      ISSUES
                    </span>

                  </div>

                  {analysis.files.map(
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

                          <span>
                            {file.totalLines}
                          </span>

                          <span>
                            {file.functionCount}
                          </span>

                          <span
                            className={
                              issues > 0
                                ? "risk-medium"
                                : "risk-high"
                            }
                          >
                            {issues}
                          </span>

                        </div>

                      );
                    }
                  )}

                </div>

              </div>

            </section>

            {/* DETAILED FILE CARDS */}

            <section
              className="dashboard-section"
            >

              <div
                className="dashboard-grid"
              >

                {analysis.files.map(
                  (file) => (

                    <div
                      className="dashboard-card"
                      key={
                        `${file.path}-details`
                      }
                    >

                      <div className="card-header">

                        <div>

                          <h2>
                            {file.path}
                          </h2>

                          <p>
                            Detailed metrics
                          </p>

                        </div>

                      </div>

                      <div
                        className="activity-list"
                      >

                        <div
                          className="activity-item"
                        >

                          <div
                            className="activity-icon"
                          >
                            #
                          </div>

                          <div
                            className="activity-content"
                          >

                            <strong>
                              Total Lines
                            </strong>

                            <span>
                              {file.totalLines}
                            </span>

                          </div>

                        </div>

                        <div
                          className="activity-item"
                        >

                          <div
                            className="activity-icon"
                          >
                            C
                          </div>

                          <div
                            className="activity-content"
                          >

                            <strong>
                              Code Lines
                            </strong>

                            <span>
                              {file.codeLines}
                            </span>

                          </div>

                        </div>

                        <div
                          className="activity-item"
                        >

                          <div
                            className="activity-icon"
                          >
                            ƒ
                          </div>

                          <div
                            className="activity-content"
                          >

                            <strong>
                              Functions
                            </strong>

                            <span>
                              {file.functionCount}
                            </span>

                          </div>

                        </div>

                        <div
                          className="activity-item"
                        >

                          <div
                            className="activity-icon"
                          >
                            !
                          </div>

                          <div
                            className="activity-content"
                          >

                            <strong>
                              Long Lines
                            </strong>

                            <span>
                              {file.longLines}
                            </span>

                          </div>

                        </div>

                        <div
                          className="activity-item"
                        >

                          <div
                            className="activity-icon"
                          >
                            T
                          </div>

                          <div
                            className="activity-content"
                          >

                            <strong>
                              TODO / FIXME
                            </strong>

                            <span>
                              {file.todoCount}
                            </span>

                          </div>

                        </div>

                        <div
                          className="activity-item"
                        >

                          <div
                            className="activity-icon"
                          >
                            $
                          </div>

                          <div
                            className="activity-content"
                          >

                            <strong>
                              Console Statements
                            </strong>

                            <span>
                              {file.consoleCount}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

          </>

        )}

      </section>

    </main>
  );
}

/* ================================================= */
/* METRIC COMPONENT */
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