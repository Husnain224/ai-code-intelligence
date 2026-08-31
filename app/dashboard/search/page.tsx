"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SecurityIssue = {
  file: string;
  line: number;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  message: string;
  code: string;
};

type SecurityData = {
  repository: string;
  branch: string;

  summary: {
    securityScore: number;
    riskLevel: string;
    filesScanned: number;
    issuesFound: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };

  issues: SecurityIssue[];
};

export default function SecurityDashboard() {
  const router = useRouter();

  const [data, setData] =
    useState<SecurityData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function runSecurityScan() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/security?owner=Husnain224&repo=ai-code-intelligence&branch=main",
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Security scan failed"
        );
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Security scan failed"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSecurityScan();
  }, []);

  const summary =
    data?.summary;

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
            active
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

      {/* MAIN */}

      <section className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="breadcrumb">
              Workspace / Security
            </p>

            <h1>
              Security Analysis
            </h1>

          </div>

          <div className="dashboard-actions">

            <button
              className="header-button"
              onClick={
                runSecurityScan
              }
              disabled={loading}
            >
              ↻{" "}
              {loading
                ? "Scanning..."
                : "Run Security Scan"}
            </button>

          </div>

        </header>

        {/* ERROR */}

        {error && (
          <div
            style={{
              padding:
                "14px 18px",
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

            <span className="online-dot" />

            {loading
              ? "Scanning repository..."
              : "Security scan complete"}

            <span className="branch">
              {data?.branch ||
                "main"}
            </span>

          </div>

        </div>

        {/* SECURITY SCORE */}

        <section className="dashboard-section">

          <div className="health-card">

            <div className="health-score">

              <span>
                Security Score
              </span>

              <strong>
                {loading
                  ? "..."
                  : summary
                    ?.securityScore}
              </strong>

              <small>
                {loading
                  ? "Scanning"
                  : summary
                    ?.riskLevel}
              </small>

            </div>

            <div
              style={{
                flex: 1,
                padding:
                  "10px 20px",
              }}
            >

              <h2>
                Repository Security
              </h2>

              <p>
                Static security
                analysis of your
                GitHub repository.
              </p>

              <div
                style={{
                  marginTop:
                    "20px",
                  height:
                    "12px",
                  background:
                    "#e5e7eb",
                  borderRadius:
                    "10px",
                  overflow:
                    "hidden",
                }}
              >

                <div
                  style={{
                    width: `${
                      summary
                        ?.securityScore ||
                      0
                    }%`,
                    height: "100%",
                    background:
                      summary
                        ?.securityScore &&
                      summary.securityScore <
                        50
                        ? "#dc2626"
                        : "#16a34a",
                    transition:
                      "width 0.5s",
                  }}
                />

              </div>

            </div>

          </div>

        </section>

        {/* SECURITY METRICS */}

        <section className="dashboard-section">

          <div className="metrics-dashboard">

            <SecurityMetric
              title="Critical"
              value={
                loading
                  ? "..."
                  : String(
                      summary
                        ?.critical ||
                        0
                    )
              }
              description="Immediate action"
            />

            <SecurityMetric
              title="High"
              value={
                loading
                  ? "..."
                  : String(
                      summary
                        ?.high ||
                        0
                    )
              }
              description="High priority"
            />

            <SecurityMetric
              title="Medium"
              value={
                loading
                  ? "..."
                  : String(
                      summary
                        ?.medium ||
                        0
                    )
              }
              description="Review required"
            />

            <SecurityMetric
              title="Low"
              value={
                loading
                  ? "..."
                  : String(
                      summary
                        ?.low ||
                        0
                    )
              }
              description="Minor issues"
            />

          </div>

        </section>

        {/* SCAN STATISTICS */}

        <section className="dashboard-section">

          <div className="dashboard-grid">

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <h2>
                    Scan Statistics
                  </h2>

                  <p>
                    Security analysis
                    information.
                  </p>

                </div>

              </div>

              <div className="activity-list">

                <StatRow
                  icon="#"
                  title="Files Scanned"
                  value={
                    loading
                      ? "..."
                      : String(
                          summary
                            ?.filesScanned ||
                            0
                        )
                  }
                />

                <StatRow
                  icon="!"
                  title="Issues Found"
                  value={
                    loading
                      ? "..."
                      : String(
                          summary
                            ?.issuesFound ||
                            0
                        )
                  }
                />

                <StatRow
                  icon="✓"
                  title="Security Score"
                  value={
                    loading
                      ? "..."
                      : `${summary?.securityScore || 0}/100`
                  }
                />

                <StatRow
                  icon="◇"
                  title="Risk Level"
                  value={
                    loading
                      ? "..."
                      : summary
                          ?.riskLevel ||
                        "Unknown"
                  }
                />

              </div>

            </div>

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <h2>
                    Detected Categories
                  </h2>

                  <p>
                    Security patterns
                    checked by the
                    analyzer.
                  </p>

                </div>

              </div>

              <div className="activity-list">

                <StatRow
                  icon="🔑"
                  title="Hardcoded Secrets"
                  value="Checked"
                />

                <StatRow
                  icon="⚠"
                  title="XSS Patterns"
                  value="Checked"
                />

                <StatRow
                  icon="▣"
                  title="SQL Injection"
                  value="Checked"
                />

                <StatRow
                  icon="⌘"
                  title="Command Execution"
                  value="Checked"
                />

                <StatRow
                  icon="🔒"
                  title="TLS Configuration"
                  value="Checked"
                />

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
                  Security Issues
                </h2>

                <p>
                  Potential security
                  problems discovered
                  in your repository.
                </p>

              </div>

            </div>

            <div className="security-issues">

              {loading ? (

                <div
                  className="risk-table-row"
                >
                  Scanning files...
                </div>

              ) : !data ||
                data.issues.length ===
                  0 ? (

                <div
                  style={{
                    padding:
                      "30px",
                    textAlign:
                      "center",
                  }}
                >

                  <div
                    style={{
                      fontSize:
                        "36px",
                      marginBottom:
                        "10px",
                    }}
                  >
                    ✓
                  </div>

                  <strong>
                    No security
                    issues detected
                  </strong>

                  <p>
                    The current
                    static analyzer
                    did not find
                    any known
                    security
                    patterns.
                  </p>

                </div>

              ) : (

                data.issues.map(
                  (
                    issue,
                    index
                  ) => (

                    <SecurityIssueRow
                      key={`${issue.file}-${issue.line}-${index}`}
                      issue={issue}
                    />

                  )
                )

              )}

            </div>

          </div>

        </section>

        {/* INFORMATION */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Security Scanner
                </h2>

                <p>
                  Current scanner
                  performs static
                  pattern-based
                  analysis.
                </p>

              </div>

            </div>

            <div
              style={{
                padding:
                  "10px 0",
                lineHeight:
                  "1.7",
              }}
            >

              <p>
                The scanner currently
                checks source files
                for common security
                patterns including
                hardcoded secrets,
                API keys, unsafe
                eval usage, XSS
                patterns, SQL
                injection patterns,
                command execution,
                disabled TLS
                verification, and
                insecure HTTP
                connections.
              </p>

              <p>
                This is a static
                analysis tool and
                does not guarantee
                that a repository is
                completely secure.
              </p>

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
/* SECURITY METRIC */
/* ================================================= */

function SecurityMetric({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="dashboard-metric">

      <div className="metric-title">

        <span>
          {title}
        </span>

        <span>
          •••
        </span>

      </div>

      <div className="metric-value">

        <strong>
          {value}
        </strong>

      </div>

      <div className="metric-bottom">

        <span className="metric-trend">
          Security
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
/* SECURITY ISSUE */
/* ================================================= */

function SecurityIssueRow({
  issue,
}: {
  issue: SecurityIssue;
}) {
  const severityClass =
    issue.severity ===
    "Critical"
      ? "risk-high"
      : issue.severity ===
        "High"
      ? "risk-high"
      : "risk-medium";

  return (
    <div
      style={{
        padding:
          "18px 0",
        borderBottom:
          "1px solid #e5e7eb",
      }}
    >

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap: "15px",
          marginBottom:
            "8px",
        }}
      >

        <div>

          <strong>
            {issue.type}
          </strong>

          <div
            style={{
              marginTop:
                "4px",
              fontSize:
                "13px",
              color:
                "#6b7280",
            }}
          >
            {issue.file}
            :
            {issue.line}
          </div>

        </div>

        <span
          className={
            severityClass
          }
        >
          {issue.severity}
        </span>

      </div>

      <p>
        {issue.message}
      </p>

      <code
        style={{
          display:
            "block",
          marginTop:
            "10px",
          padding:
            "10px",
          background:
            "#f3f4f6",
          borderRadius:
            "6px",
          fontSize:
            "12px",
          overflowX:
            "auto",
        }}
      >
        {issue.code}
      </code>

    </div>
  );
}