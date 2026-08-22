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

export default function SecurityPage() {
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

  /*
   * Simple security rules.
   *
   * Later we will replace this with
   * a real security scanner.
   */

  const securityIssues = files.flatMap(
    (file) => {
      const issues = [];

      if (file.consoleCount > 0) {
        issues.push({
          file: file.path,
          severity: "Medium",
          type: "Console Statement",
          description:
            "Console statements may expose debugging information.",
        });
      }

      if (file.longLines > 5) {
        issues.push({
          file: file.path,
          severity: "Low",
          type: "Long Lines",
          description:
            "Large lines may reduce code readability and maintainability.",
        });
      }

      if (file.todoCount > 0) {
        issues.push({
          file: file.path,
          severity: "Medium",
          type: "TODO / FIXME",
          description:
            "Unresolved development markers were detected.",
        });
      }

      return issues;
    }
  );

  const highIssues =
    securityIssues.filter(
      (issue) =>
        issue.severity === "High"
    ).length;

  const mediumIssues =
    securityIssues.filter(
      (issue) =>
        issue.severity === "Medium"
    ).length;

  const lowIssues =
    securityIssues.filter(
      (issue) =>
        issue.severity === "Low"
    ).length;

  const securityScore = Math.max(
    0,
    100 -
      highIssues * 20 -
      mediumIssues * 8 -
      lowIssues * 3
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
            className="dashboard-nav-item active"
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

          <button className="dashboard-nav-item">
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
              Security
            </p>

            <h1>
              Security Analysis
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
                ? "Scanning..."
                : "Scan Again"}
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
              ? "Security scan running..."
              : "Security scan complete"}

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

        {/* SECURITY METRICS */}

        <section className="dashboard-section">

          <div className="metrics-dashboard">

            <DashboardMetric
              title="Security Score"
              value={
                loading
                  ? "..."
                  : String(securityScore)
              }
              suffix="/100"
              trend="Live"
              description={
                securityScore >= 90
                  ? "Secure"
                  : securityScore >= 70
                  ? "Needs Attention"
                  : "At Risk"
              }
            />

            <DashboardMetric
              title="Critical"
              value={
                loading
                  ? "..."
                  : String(highIssues)
              }
              suffix=""
              trend="Detected"
              description="Critical issues"
            />

            <DashboardMetric
              title="Medium"
              value={
                loading
                  ? "..."
                  : String(mediumIssues)
              }
              suffix=""
              trend="Detected"
              description="Medium issues"
            />

            <DashboardMetric
              title="Low"
              value={
                loading
                  ? "..."
                  : String(lowIssues)
              }
              suffix=""
              trend="Detected"
              description="Low issues"
            />

          </div>

        </section>

        {/* SECURITY STATUS */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Security Status
                </h2>

                <p>
                  Current security posture
                  of your repository.
                </p>

              </div>

            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "30px",
                padding: "30px",
              }}
            >

              <div
                style={{
                  width: "140px",
                  height: "140px",
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
                    fontSize: "34px",
                  }}
                >
                  {loading
                    ? "..."
                    : securityScore}
                </strong>

                <span>
                  /100
                </span>

              </div>

              <div>

                <h2>
                  {securityScore >= 90
                    ? "Repository is Secure"
                    : securityScore >= 70
                    ? "Security Needs Attention"
                    : "Security Risk Detected"}
                </h2>

                <p>
                  The scanner reviewed
                  {analysis?.summary
                    ?.filesAnalyzed ?? 0}{" "}
                  source files for
                  potentially problematic
                  patterns.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ISSUES */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Security Findings
                </h2>

                <p>
                  Potential security and
                  maintainability issues.
                </p>

              </div>

            </div>

            <div className="risk-table">

              <div className="risk-table-header">

                <span>
                  FILE
                </span>

                <span>
                  SEVERITY
                </span>

                <span>
                  ISSUE
                </span>

                <span>
                  DETAILS
                </span>

              </div>

              {loading ? (

                <div className="risk-table-row">

                  <span>
                    Scanning repository...
                  </span>

                </div>

              ) : securityIssues.length === 0 ? (

                <div className="risk-table-row">

                  <span>
                    No security issues detected.
                  </span>

                </div>

              ) : (

                securityIssues.map(
                  (issue, index) => (

                    <div
                      className="risk-table-row"
                      key={`${issue.file}-${index}`}
                    >

                      <span className="file-name">
                        {issue.file}
                      </span>

                      <span
                        className={
                          issue.severity ===
                          "High"
                            ? "risk-high"
                            : "risk-medium"
                        }
                      >
                        {issue.severity}
                      </span>

                      <span>
                        {issue.type}
                      </span>

                      <span>
                        {issue.description}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>

        {/* SECURITY RULES */}

        <section className="dashboard-section">

          <div className="dashboard-grid">

            <SecurityCard
              title="Console Exposure"
              description="Detects console statements that may expose internal debugging information."
              count={
                analysis?.summary
                  ?.totalConsoleStatements ??
                0
              }
            />

            <SecurityCard
              title="Unresolved TODOs"
              description="Finds TODO and FIXME markers that may indicate unfinished implementation."
              count={
                analysis?.summary
                  ?.totalTodos ?? 0
              }
            />

            <SecurityCard
              title="Long Code Lines"
              description="Identifies unusually long lines that can make security reviews harder."
              count={files.reduce(
                (sum, file) =>
                  sum + file.longLines,
                0
              )}
            />

          </div>

        </section>

        {/* RECOMMENDATION */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Security Recommendations
                </h2>

                <p>
                  Suggested improvements for
                  your repository.
                </p>

              </div>

            </div>

            <div
              style={{
                padding: "20px 25px",
              }}
            >

              <ul
                style={{
                  lineHeight: "2",
                  paddingLeft: "20px",
                }}
              >

                <li>
                  Remove unnecessary console
                  statements before production.
                </li>

                <li>
                  Resolve TODO and FIXME
                  markers.
                </li>

                <li>
                  Keep functions small and
                  focused.
                </li>

                <li>
                  Review high-risk files
                  before deployment.
                </li>

                <li>
                  Add automated security
                  scanning to CI/CD.
                </li>

              </ul>

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
/* SECURITY CARD */
/* ================================================= */

function SecurityCard({
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
            fontSize: "36px",
          }}
        >
          {count}
        </strong>

        <p>
          Findings detected
        </p>

      </div>

    </div>
  );
}