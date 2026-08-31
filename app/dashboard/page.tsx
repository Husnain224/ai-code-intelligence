
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SecuritySummary = {
  securityScore: number;
  riskLevel: string;
  filesScanned: number;
  issuesFound: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
};

export default function Dashboard() {
  const router = useRouter();

  const [analysis, setAnalysis] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [security, setSecurity] =
    useState<SecuritySummary | null>(null);

  const [securityLoading, setSecurityLoading] =
    useState(true);

  /*
   * =====================================================
   * CODE ANALYSIS
   * =====================================================
   */

  async function runAnalysis() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/analyze/full?owner=Husnain224&repo=ai-code-intelligence",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Analysis failed"
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

  /*
   * =====================================================
   * SECURITY ANALYSIS
   * =====================================================
   */

  async function runSecurityScan() {
    try {
      setSecurityLoading(true);

      const response = await fetch(
        "/api/security?owner=Husnain224&repo=ai-code-intelligence&branch=main",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Security scan failed"
        );
      }

      setSecurity(
        data.summary
      );
    } catch (err) {
      console.error(
        "Security scan error:",
        err
      );
    } finally {
      setSecurityLoading(false);
    }
  }

  /*
   * =====================================================
   * INITIAL LOAD
   * =====================================================
   */

  useEffect(() => {
    runAnalysis();
    runSecurityScan();
  }, []);

  /*
   * =====================================================
   * ANALYSIS VALUES
   * =====================================================
   */

  const qualityScore =
    analysis?.summary
      ?.qualityScore ?? 0;

  const qualityLabel =
    analysis?.summary
      ?.qualityLabel ??
    "Analyzing";

  const bugRisk =
    analysis?.summary
      ?.bugRisk ?? 0;

  const filesAnalyzed =
    analysis?.summary
      ?.filesAnalyzed ?? 0;

  const totalLines =
    analysis?.summary
      ?.totalLines ?? 0;

  const totalTodos =
    analysis?.summary
      ?.totalTodos ?? 0;

  const totalConsole =
    analysis?.summary
      ?.totalConsoleStatements ??
    0;

  /*
   * =====================================================
   * RISK FILES
   * =====================================================
   */

  const riskFiles =
    (analysis?.files ?? [])
      .map((file: any) => {
        const risk =
          file.longLines * 10 +
          file.functionCount * 5;

        return {
          file: file.path,

          risk: Math.min(
            risk,
            100
          ),

          complexity:
            file.functionCount >=
            8
              ? "High"
              : file.functionCount >=
                4
              ? "Medium"
              : "Low",

          issues:
            file.todoCount +
            file.consoleCount +
            file.longLines,
        };
      })
      .sort(
        (a: any, b: any) =>
          b.risk - a.risk
      )
      .slice(0, 5);

  /*
   * =====================================================
   * SECURITY VALUES
   * =====================================================
   */

  const securityScore =
    security?.securityScore ?? 0;

  const securityRisk =
    security?.riskLevel ??
    "Unknown";

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

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
            active
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

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="dashboard-header">

          <div>

            <p className="breadcrumb">
              Workspace / Repository
            </p>

            <h1>
              AI Code Intelligence
            </h1>

          </div>

          <div className="dashboard-actions">

            <button
              className="header-button"
              onClick={() => {
                runAnalysis();
                runSecurityScan();
              }}
              disabled={
                loading ||
                securityLoading
              }
            >
              ↻{" "}

              {loading ||
              securityLoading
                ? "Analyzing..."
                : "Re-analyze"}

            </button>

            <button
              className="primary-small"
              onClick={() =>
                alert(
                  "Repository connection coming next"
                )
              }
            >
              + Repository
            </button>

          </div>

        </header>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (

          <div
            style={{
              padding:
                "12px 16px",

              marginBottom:
                "20px",

              background:
                "#fee2e2",

              color:
                "#991b1b",

              borderRadius:
                "8px",
            }}
          >
            {error}
          </div>

        )}

        {/* ================================================= */}
        {/* REPOSITORY */}
        {/* ================================================= */}

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

            <span className="online-dot" />

            {loading ||
            securityLoading
              ? "Analyzing repository..."
              : "Analysis up to date"}

            <span className="branch">
              main
            </span>

          </div>

        </div>

        {/* ================================================= */}
        {/* MAIN METRICS */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="metrics-dashboard">

            {/* CODE QUALITY */}

            <DashboardMetric
              title="Code Quality"
              value={
                loading
                  ? "..."
                  : String(
                      qualityScore
                    )
              }
              suffix="/100"
              trend="Live"
              description={
                qualityLabel
              }
              onClick={() =>
                router.push(
                  "/dashboard/analysis"
                )
              }
            />

            {/* SECURITY */}

            <DashboardMetric
              title="Security"
              value={
                securityLoading
                  ? "..."
                  : String(
                      securityScore
                    )
              }
              suffix="/100"
              trend={
                securityLoading
                  ? "Scanning"
                  : "Live"
              }
              description={
                securityLoading
                  ? "Security analysis"
                  : securityRisk
              }
              onClick={() =>
                router.push(
                  "/dashboard/security"
                )
              }
            />

            {/* BUG RISK */}

            <DashboardMetric
              title="Bug Risk"
              value={
                loading
                  ? "..."
                  : String(
                      bugRisk
                    )
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
              onClick={() =>
                router.push(
                  "/dashboard/bugs"
                )
              }
            />

            {/* TECHNICAL DEBT */}

            <DashboardMetric
              title="Technical Debt"
              value="N/A"
              suffix=""
              trend="Coming"
              description="Analysis pending"
              onClick={() =>
                router.push(
                  "/dashboard/debt"
                )
              }
            />

          </div>

        </section>

        {/* ================================================= */}
        {/* REPOSITORY HEALTH */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="section-title-row">

            <div>

              <h2>
                Repository Health
              </h2>

              <p>
                Real-time analysis of your
                GitHub repository.
              </p>

            </div>

            <select
              className="period-select"
            >

              <option>
                Current Analysis
              </option>

              <option>
                Previous Analysis
              </option>

            </select>

          </div>

          <div className="health-card">

            <div className="health-score">

              <span>
                Current Score
              </span>

              <strong>

                {loading
                  ? "..."
                  : qualityScore}

              </strong>

              <small>
                {qualityLabel}
              </small>

            </div>

            <div className="health-chart">

              {[
                58,
                63,
                60,
                68,
                66,
                72,
                69,
                75,
                78,
                81,
                83,
                86,
              ].map(
                (
                  height,
                  index
                ) => (

                  <div
                    key={index}
                    className="health-bar-wrapper"
                  >

                    <div
                      className="health-bar"
                      style={{
                        height:
                          `${height}%`,
                      }}
                    />

                    <span>
                      {index + 1}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* TWO COLUMNS */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="dashboard-grid">

            {/* REPOSITORY STATISTICS */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <h2>
                    Repository Statistics
                  </h2>

                  <p>
                    Real data collected
                    from GitHub.
                  </p>

                </div>

              </div>

              <div className="activity-list">

                <StatRow
                  icon="#"
                  title="Files Analyzed"
                  value={
                    loading
                      ? "..."
                      : `${filesAnalyzed} files`
                  }
                />

                <StatRow
                  icon="≡"
                  title="Total Lines"
                  value={
                    loading
                      ? "..."
                      : `${totalLines.toLocaleString()} lines`
                  }
                />

                <StatRow
                  icon="✓"
                  title="TODO Items"
                  value={
                    loading
                      ? "..."
                      : String(
                          totalTodos
                        )
                  }
                />

                <StatRow
                  icon="!"
                  title="Console Statements"
                  value={
                    loading
                      ? "..."
                      : String(
                          totalConsole
                        )
                  }
                />

              </div>

            </div>

            {/* HIGHEST RISK FILES */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <h2>
                    Highest Risk Files
                  </h2>

                  <p>
                    Files requiring
                    engineering attention.
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
                  View all →
                </button>

              </div>

              <div className="risk-table">

                <div className="risk-table-header">

                  <span>
                    FILE
                  </span>

                  <span>
                    RISK
                  </span>

                  <span>
                    COMPLEXITY
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

                ) : riskFiles.length ===
                  0 ? (

                  <div className="risk-table-row">

                    <span>
                      No files found
                    </span>

                  </div>

                ) : (

                  riskFiles.map(
                    (file: any) => (

                      <div
                        className="risk-table-row"
                        key={
                          file.file
                        }
                      >

                        <span className="file-name">
                          {file.file}
                        </span>

                        <span
                          className={
                            file.risk >=
                            80
                              ? "risk-high"
                              : "risk-medium"
                          }
                        >
                          {file.risk}%
                        </span>

                        <span>
                          {
                            file.complexity
                          }
                        </span>

                        <span>
                          {
                            file.issues
                          }
                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* SECURITY SUMMARY */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Security Summary
                </h2>

                <p>
                  Latest static security
                  analysis.
                </p>

              </div>

              <button
                className="text-button"
                onClick={() =>
                  router.push(
                    "/dashboard/security"
                  )
                }
              >
                View Security →
              </button>

            </div>

            <div className="metrics-dashboard">

              <SecurityMiniMetric
                title="Security Score"
                value={
                  securityLoading
                    ? "..."
                    : `${securityScore}/100`
                }
              />

              <SecurityMiniMetric
                title="Critical"
                value={
                  securityLoading
                    ? "..."
                    : String(
                        security?.critical ??
                        0
                      )
                }
              />

              <SecurityMiniMetric
                title="High"
                value={
                  securityLoading
                    ? "..."
                    : String(
                        security?.high ??
                        0
                      )
                }
              />

              <SecurityMiniMetric
                title="Issues Found"
                value={
                  securityLoading
                    ? "..."
                    : String(
                        security?.issuesFound ??
                        0
                      )
                }
              />

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================= */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Analysis Tools
                </h2>

                <p>
                  Explore different areas
                  of your repository.
                </p>

              </div>

            </div>

            <div
              className="metrics-dashboard"
              style={{
                marginTop:
                  "20px",
              }}
            >

              <button
                className="dashboard-metric"
                onClick={() =>
                  router.push(
                    "/dashboard/analysis"
                  )
                }
              >

                <div className="metric-title">

                  <span>
                    Code Analysis
                  </span>

                  <span>
                    →
                  </span>

                </div>

                <div className="metric-value">

                  <strong>
                    {
                      filesAnalyzed
                    }
                  </strong>

                  <span>
                    files
                  </span>

                </div>

                <div className="metric-bottom">

                  <span className="metric-trend">
                    Analyze
                  </span>

                  <span>
                    Code quality
                  </span>

                </div>

              </button>

              <button
                className="dashboard-metric"
                onClick={() =>
                  router.push(
                    "/dashboard/security"
                  )
                }
              >

                <div className="metric-title">

                  <span>
                    Security
                  </span>

                  <span>
                    →
                  </span>

                </div>

                <div className="metric-value">

                  <strong>
                    {
                      securityLoading
                        ? "..."
                        : securityScore
                    }
                  </strong>

                  <span>
                    /100
                  </span>

                </div>

                <div className="metric-bottom">

                  <span className="metric-trend">
                    Scan
                  </span>

                  <span>
                    Security status
                  </span>

                </div>

              </button>

              <button
                className="dashboard-metric"
                onClick={() =>
                  router.push(
                    "/dashboard/bugs"
                  )
                }
              >

                <div className="metric-title">

                  <span>
                    Bug Prediction
                  </span>

                  <span>
                    →
                  </span>

                </div>

                <div className="metric-value">

                  <strong>
                    {bugRisk}
                  </strong>

                  <span>
                    %
                  </span>

                </div>

                <div className="metric-bottom">

                  <span className="metric-trend">
                    View
                  </span>

                  <span>
                    Bug risk
                  </span>

                </div>

              </button>

              <button
                className="dashboard-metric"
                onClick={() =>
                  router.push(
                    "/dashboard/assistant"
                  )
                }
              >

                <div className="metric-title">

                  <span>
                    AI Assistant
                  </span>

                  <span>
                    →
                  </span>

                </div>

                <div className="metric-value">

                  <strong>
                    AI
                  </strong>

                </div>

                <div className="metric-bottom">

                  <span className="metric-trend">
                    Ask
                  </span>

                  <span>
                    Repository assistant
                  </span>

                </div>

              </button>

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
        active
          ? "active"
          : ""
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
/* DASHBOARD METRIC */
/* ================================================= */

function DashboardMetric({
  title,
  value,
  suffix,
  trend,
  description,
  onClick,
}: {
  title: string;
  value: string;
  suffix: string;
  trend: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="dashboard-metric"
      onClick={onClick}
      role={
        onClick
          ? "button"
          : undefined
      }
      tabIndex={
        onClick
          ? 0
          : undefined
      }
      onKeyDown={(event) => {

        if (
          onClick &&
          event.key ===
            "Enter"
        ) {
          onClick();
        }

      }}
      style={{
        cursor: onClick
          ? "pointer"
          : "default",
      }}
    >

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
/* STAT ROW */
/* ================================================= */

function StatRow({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="activity-item">

      <div className="activity-icon">
        {icon}
      </div>

      <div className="activity-content">

        <strong>
          {title}
        </strong>

        <span>
          {value}
        </span>

      </div>

    </div>
  );
}


/* ================================================= */
/* SECURITY MINI METRIC */
/* ================================================= */

function SecurityMiniMetric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="dashboard-metric">

      <div className="metric-title">

        <span>
          {title}
        </span>

        <span>
          ◇
        </span>

      </div>

      <div className="metric-value">

        <strong>
          {value}
        </strong>

      </div>

      <div className="metric-bottom">

        <span className="metric-trend">
          Live
        </span>

        <span>
          Security
        </span>

      </div>

    </div>
  );
}
