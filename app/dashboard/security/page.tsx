"use client";

import { useEffect, useState } from "react";

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
    filesScanned: number;
    totalIssues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    securityScore: number;
    securityLabel: string;
  };
  issues: SecurityIssue[];
};

export default function SecurityPage() {
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function runSecurityScan() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/security?owner=Husnain224&repo=ai-code-intelligence"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Security scan failed"
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

  const summary = data?.summary;

  return (
    <main className="dashboard-page">
      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <div className="logo-icon">AI</div>

          <span>Code Intelligence</span>
        </div>

        <nav className="dashboard-nav">
          <a
            href="/dashboard"
            className="dashboard-nav-item"
          >
            <span>▦</span>
            Overview
          </a>

          <a
            href="/dashboard/analysis"
            className="dashboard-nav-item"
          >
            <span>⌘</span>
            Code Analysis
          </a>

          <a
            href="/dashboard/security"
            className="dashboard-nav-item active"
          >
            <span>◇</span>
            Security
          </a>

          <a
            href="/dashboard/bugs"
            className="dashboard-nav-item"
          >
            <span>△</span>
            Bug Prediction
          </a>

          <a
            href="/dashboard/debt"
            className="dashboard-nav-item"
          >
            <span>◈</span>
            Technical Debt
          </a>

          <a
            href="/dashboard/search"
            className="dashboard-nav-item"
          >
            <span>⌕</span>
            Semantic Search
          </a>

          <a
            href="/dashboard/assistant"
            className="dashboard-nav-item"
          >
            <span>✦</span>
            AI Assistant
          </a>
        </nav>

        <div className="sidebar-bottom">
          <button className="dashboard-nav-item">
            <span>⚙</span>
            Settings
          </button>

          <div className="user-card">
            <div className="user-avatar">HS</div>

            <div>
              <strong>Developer</strong>

              <span>Free Plan</span>
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

            <h1>Security Analysis</h1>
          </div>

          <div className="dashboard-actions">
            <button
              className="header-button"
              onClick={runSecurityScan}
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
              padding: "14px 18px",
              marginBottom: "20px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "10px",
            }}
          >
            {error}
          </div>
        )}

        {/* REPOSITORY */}

        <div className="repository-bar">
          <div className="repository-info">
            <div className="github-icon">GH</div>

            <div>
              <strong>
                ai-code-intelligence
              </strong>

              <span>
                Husnain224 / ai-code-intelligence
              </span>
            </div>
          </div>

          <div className="repository-status">
            <span className="online-dot"></span>

            {loading
              ? "Scanning repository..."
              : "Security scan complete"}

            <span className="branch">
              {data?.branch || "main"}
            </span>
          </div>
        </div>

        {/* SECURITY SCORE */}

        <section className="dashboard-section">
          <div className="security-hero-card">
            <div className="security-score-container">
              <div className="security-score-circle">
                <strong>
                  {loading
                    ? "..."
                    : summary?.securityScore ?? 0}
                </strong>

                <span>/100</span>
              </div>

              <div className="security-score-info">
                <p>Security Score</p>

                <h2>
                  {loading
                    ? "Analyzing..."
                    : summary?.securityLabel ??
                      "Unknown"}
                </h2>

                <span>
                  Automated security analysis
                  of your repository.
                </span>
              </div>
            </div>

            <div className="security-status">
              <div className="security-status-dot"></div>

              <div>
                <strong>
                  {loading
                    ? "Scanning"
                    : "Repository Secure"}
                </strong>

                <span>
                  {loading
                    ? "Please wait..."
                    : "No security vulnerabilities detected"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY METRICS */}

        <section className="dashboard-section">
          <div className="metrics-dashboard">
            <SecurityMetric
              title="Files Scanned"
              value={
                loading
                  ? "..."
                  : String(
                      summary?.filesScanned ?? 0
                    )
              }
              description="Source files analyzed"
            />

            <SecurityMetric
              title="Total Issues"
              value={
                loading
                  ? "..."
                  : String(
                      summary?.totalIssues ?? 0
                    )
              }
              description="Security findings"
            />

            <SecurityMetric
              title="Critical"
              value={
                loading
                  ? "..."
                  : String(
                      summary?.critical ?? 0
                    )
              }
              description="Critical vulnerabilities"
            />

            <SecurityMetric
              title="High"
              value={
                loading
                  ? "..."
                  : String(
                      summary?.high ?? 0
                    )
              }
              description="High-risk vulnerabilities"
            />
          </div>
        </section>

        {/* SEVERITY OVERVIEW */}

        <section className="dashboard-section">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h2>Severity Overview</h2>

                  <p>
                    Security findings grouped
                    by severity.
                  </p>
                </div>
              </div>

              <div className="severity-list">
                <SeverityRow
                  label="Critical"
                  value={
                    summary?.critical ?? 0
                  }
                />

                <SeverityRow
                  label="High"
                  value={
                    summary?.high ?? 0
                  }
                />

                <SeverityRow
                  label="Medium"
                  value={
                    summary?.medium ?? 0
                  }
                />

                <SeverityRow
                  label="Low"
                  value={
                    summary?.low ?? 0
                  }
                />
              </div>
            </div>

            {/* SCAN INFORMATION */}

            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h2>Scan Information</h2>

                  <p>
                    Details about the latest
                    security scan.
                  </p>
                </div>
              </div>

              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    ✓
                  </div>

                  <div className="activity-content">
                    <strong>
                      Repository
                    </strong>

                    <span>
                      {data?.repository ||
                        "Husnain224/ai-code-intelligence"}
                    </span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    #
                  </div>

                  <div className="activity-content">
                    <strong>
                      Branch
                    </strong>

                    <span>
                      {data?.branch || "main"}
                    </span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    ◇
                  </div>

                  <div className="activity-content">
                    <strong>
                      Scanner
                    </strong>

                    <span>
                      AI Security Scanner
                    </span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    ✓
                  </div>

                  <div className="activity-content">
                    <strong>
                      Status
                    </strong>

                    <span>
                      {loading
                        ? "Scanning..."
                        : "Completed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY ISSUES */}

        <section className="dashboard-section">
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2>Security Issues</h2>

                <p>
                  Vulnerabilities detected in
                  your repository.
                </p>
              </div>

              {!loading && (
                <span className="security-count">
                  {summary?.totalIssues ?? 0} issues
                </span>
              )}
            </div>

            {loading ? (
              <div className="empty-security">
                <div className="security-loading-icon">
                  ◌
                </div>

                <h3>
                  Scanning repository...
                </h3>

                <p>
                  Checking your source code
                  for security vulnerabilities.
                </p>
              </div>
            ) : data?.issues &&
              data.issues.length > 0 ? (
              <div className="security-issues-list">
                {data.issues.map(
                  (issue, index) => (
                    <div
                      className="security-issue"
                      key={`${issue.file}-${issue.line}-${index}`}
                    >
                      <div className="issue-severity">
                        <span
                          className={`severity-badge severity-${issue.severity.toLowerCase()}`}
                        >
                          {issue.severity}
                        </span>
                      </div>

                      <div className="issue-details">
                        <strong>
                          {issue.type}
                        </strong>

                        <span>
                          {issue.file}:
                          {issue.line}
                        </span>

                        <p>
                          {issue.message}
                        </p>

                        <code>
                          {issue.code}
                        </code>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="empty-security">
                <div className="security-success-icon">
                  ✓
                </div>

                <h3>
                  No security vulnerabilities
                  detected
                </h3>

                <p>
                  Your scanned source files
                  passed the current security
                  checks.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

/* SECURITY METRIC */

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
        <span>{title}</span>

        <span className="metric-menu">
          •••
        </span>
      </div>

      <div className="metric-value">
        <strong>{value}</strong>
      </div>

      <div className="metric-bottom">
        <span className="metric-trend">
          Live
        </span>

        <span>{description}</span>
      </div>
    </div>
  );
}

/* SEVERITY ROW */

function SeverityRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="severity-row">
      <div className="severity-label">
        <span
          className={`severity-indicator severity-${label.toLowerCase()}`}
        ></span>

        <strong>{label}</strong>
      </div>

      <span className="severity-number">
        {value}
      </span>
    </div>
  );
}
