const riskFiles = [
  {
    file: "src/auth/service.ts",
    risk: 91,
    complexity: "High",
    issues: 8,
  },
  {
    file: "src/payment/controller.ts",
    risk: 84,
    complexity: "High",
    issues: 6,
  },
  {
    file: "src/user/repository.ts",
    risk: 67,
    complexity: "Medium",
    issues: 4,
  },
  {
    file: "src/api/client.ts",
    risk: 43,
    complexity: "Low",
    issues: 2,
  },
];

const activity = [
  {
    title: "Security vulnerability detected",
    file: "src/auth/service.ts",
    time: "12 minutes ago",
  },
  {
    title: "High code complexity detected",
    file: "src/payment/controller.ts",
    time: "28 minutes ago",
  },
  {
    title: "Dependency analysis completed",
    file: "package.json",
    time: "1 hour ago",
  },
  {
    title: "Repository analysis completed",
    file: "main branch",
    time: "2 hours ago",
  },
];

export default function Dashboard() {
  return (
    <main className="dashboard-page">
      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <div className="logo-icon">AI</div>

          <span>Code Intelligence</span>
        </div>

        <nav className="dashboard-nav">
          <NavItem icon="▦" label="Overview" active />
          <NavItem icon="⌘" label="Code Analysis" />
          <NavItem icon="◇" label="Security" />
          <NavItem icon="△" label="Bug Prediction" />
          <NavItem icon="◈" label="Technical Debt" />
          <NavItem icon="⌕" label="Semantic Search" />
          <NavItem icon="✦" label="AI Assistant" />
        </nav>

        <div className="sidebar-bottom">
          <NavItem icon="⚙" label="Settings" />

          <div className="user-card">
            <div className="user-avatar">HS</div>

            <div>
              <strong>Developer</strong>
              <span>Free Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <section className="dashboard-main">
        {/* TOP BAR */}

        <header className="dashboard-header">
          <div>
            <p className="breadcrumb">Workspace / Repository</p>

            <h1>AI Code Intelligence</h1>
          </div>

          <div className="dashboard-actions">
            <button className="header-button">
              ↻ Re-analyze
            </button>

            <button className="primary-small">
              + Repository
            </button>
          </div>
        </header>

        {/* REPOSITORY */}

        <div className="repository-bar">
          <div className="repository-info">
            <div className="github-icon">GH</div>

            <div>
              <strong>ai-code-intelligence</strong>
              <span>Husnain224 / ai-code-intelligence</span>
            </div>
          </div>

          <div className="repository-status">
            <span className="online-dot"></span>
            Analysis up to date

            <span className="branch">
              main
            </span>
          </div>
        </div>

        {/* METRICS */}

        <section className="dashboard-section">
          <div className="metrics-dashboard">
            <DashboardMetric
              title="Code Quality"
              value="86"
              suffix="/100"
              trend="+4.2%"
              description="Excellent"
            />

            <DashboardMetric
              title="Security"
              value="92"
              suffix="/100"
              trend="+2.8%"
              description="Secure"
            />

            <DashboardMetric
              title="Bug Risk"
              value="18"
              suffix="%"
              trend="-6.4%"
              description="Low Risk"
            />

            <DashboardMetric
              title="Technical Debt"
              value="14"
              suffix="h"
              trend="-12%"
              description="Low"
            />
          </div>
        </section>

        {/* ANALYSIS */}

        <section className="dashboard-section">
          <div className="section-title-row">
            <div>
              <h2>Repository Health</h2>

              <p>
                Overall health and engineering quality
                over the last 12 analysis cycles.
              </p>
            </div>

            <select className="period-select">
              <option>Last 12 analyses</option>
              <option>Last 30 analyses</option>
              <option>Last 90 analyses</option>
            </select>
          </div>

          <div className="health-card">
            <div className="health-score">
              <span>Current Score</span>

              <strong>86</strong>

              <small>Excellent</small>
            </div>

            <div className="health-chart">
              {[58, 63, 60, 68, 66, 72, 69, 75, 78, 81, 83, 86].map(
                (height, index) => (
                  <div
                    key={index}
                    className="health-bar-wrapper"
                  >
                    <div
                      className="health-bar"
                      style={{ height: `${height}%` }}
                    ></div>

                    <span>{index + 1}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* TWO COLUMNS */}

        <section className="dashboard-grid">
          {/* RISK FILES */}

          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2>Highest Risk Files</h2>

                <p>
                  Files requiring engineering attention.
                </p>
              </div>

              <button className="text-button">
                View all →
              </button>
            </div>

            <div className="risk-table">
              <div className="risk-table-header">
                <span>FILE</span>
                <span>RISK</span>
                <span>COMPLEXITY</span>
                <span>ISSUES</span>
              </div>

              {riskFiles.map((file) => (
                <div className="risk-table-row" key={file.file}>
                  <span className="file-name">
                    {file.file}
                  </span>

                  <span
                    className={
                      file.risk >= 80
                        ? "risk-high"
                        : "risk-medium"
                    }
                  >
                    {file.risk}%
                  </span>

                  <span>{file.complexity}</span>

                  <span>{file.issues}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVITY */}

          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2>Recent Activity</h2>

                <p>
                  Latest repository analysis events.
                </p>
              </div>
            </div>

            <div className="activity-list">
              {activity.map((item) => (
                <div
                  className="activity-item"
                  key={item.title}
                >
                  <div className="activity-icon">!</div>

                  <div className="activity-content">
                    <strong>{item.title}</strong>

                    <span>{item.file}</span>

                    <small>{item.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`dashboard-nav-item ${
        active ? "active" : ""
      }`}
    >
      <span>{icon}</span>

      {label}
    </button>
  );
}

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
        <span>{title}</span>

        <span className="metric-menu">•••</span>
      </div>

      <div className="metric-value">
        <strong>{value}</strong>

        <span>{suffix}</span>
      </div>

      <div className="metric-bottom">
        <span className="metric-trend">{trend}</span>

        <span>{description}</span>
      </div>
    </div>
  );
}