
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

export default function SemanticSearchPage() {
  const router = useRouter();

  const [analysis, setAnalysis] =
    useState<AnalysisData | null>(null);

  const [query, setQuery] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [searching, setSearching] =
    useState(false);

  const [error, setError] =
    useState("");

  const [results, setResults] =
    useState<FileData[]>([]);

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
      setResults(data.files ?? []);
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

  function performSearch() {
    const searchText =
      query.trim().toLowerCase();

    if (!searchText) {
      setResults(
        analysis?.files ?? []
      );
      return;
    }

    setSearching(true);

    const files =
      analysis?.files ?? [];

    const filtered = files.filter(
      (file) => {
        const searchableText =
          [
            file.path,
            file.totalLines.toString(),
            file.codeLines.toString(),
            file.functionCount.toString(),
          ]
            .join(" ")
            .toLowerCase();

        return searchableText.includes(
          searchText
        );
      }
    );

    setTimeout(() => {
      setResults(filtered);
      setSearching(false);
    }, 300);
  }

  function handleSearch(
    event: React.FormEvent
  ) {
    event.preventDefault();
    performSearch();
  }

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
              router.push(
                "/dashboard"
              )
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
            className="dashboard-nav-item"
            onClick={() =>
              router.push(
                "/dashboard/technical-debt"
              )
            }
          >
            <span>◈</span>
            Technical Debt
          </button>

          <button
            className="dashboard-nav-item active"
            onClick={() =>
              router.push(
                "/dashboard/search"
              )
            }
          >
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

      {/* MAIN CONTENT */}

      <section className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <p className="breadcrumb">
              Workspace / Repository /
              Semantic Search
            </p>

            <h1>
              Semantic Search
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
                ? "Loading..."
                : "Refresh"}
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
              ? "Loading repository..."
              : "Repository indexed"}

            <span className="branch">
              {analysis?.branch ??
                "main"}
            </span>

          </div>

        </div>

        {/* SEARCH */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Search Your Codebase
                </h2>

                <p>
                  Find files using names,
                  paths, and repository
                  metadata.
                </p>

              </div>

            </div>

            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                gap: "12px",
                padding:
                  "20px 25px 30px",
              }}
            >

              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search files, components, functions..."
                style={{
                  flex: 1,
                  padding:
                    "14px 16px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    "8px",
                  fontSize:
                    "15px",
                  outline: "none",
                }}
              />

              <button
                type="submit"
                className="primary-small"
                disabled={
                  loading ||
                  searching
                }
              >
                {searching
                  ? "Searching..."
                  : "Search"}
              </button>

            </form>

          </div>

        </section>

        {/* SEARCH STATS */}

        <section className="dashboard-section">

          <div className="metrics-dashboard">

            <DashboardMetric
              title="Files Indexed"
              value={
                loading
                  ? "..."
                  : String(
                      analysis?.summary
                        ?.filesAnalyzed ??
                        0
                    )
              }
              suffix=""
              trend="Live"
              description="Repository files"
            />

            <DashboardMetric
              title="Results"
              value={
                loading
                  ? "..."
                  : String(
                      results.length
                    )
              }
              suffix=""
              trend="Current"
              description="Matching files"
            />

            <DashboardMetric
              title="Lines Indexed"
              value={
                loading
                  ? "..."
                  : String(
                      analysis?.summary
                        ?.totalLines ??
                        0
                    )
              }
              suffix=""
              trend="Indexed"
              description="Total lines"
            />

            <DashboardMetric
              title="Branch"
              value={
                analysis?.branch ??
                "main"
              }
              suffix=""
              trend="Active"
              description="Repository branch"
            />

          </div>

        </section>

        {/* RESULTS */}

        <section className="dashboard-section">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Search Results
                </h2>

                <p>
                  {query
                    ? `Results for "${query}"`
                    : "All indexed files"}
                </p>

              </div>

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

              {loading ? (

                <div
                  className="risk-table-row"
                >

                  <span>
                    Indexing repository...
                  </span>

                </div>

              ) : results.length ===
                0 ? (

                <div
                  className="risk-table-row"
                >

                  <span>
                    No matching files
                    found.
                  </span>

                </div>

              ) : (

                results.map(
                  (file) => (

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
                        {file.codeLines}
                      </span>

                      <span>
                        {file.functionCount}
                      </span>

                      <span>
                        {file.todoCount +
                          file.consoleCount +
                          file.longLines}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>

        {/* SEARCH EXAMPLES */}

        <section className="dashboard-section">

          <div className="dashboard-grid">

            <SearchExample
              title="Components"
              query="components"
              onSearch={(value) => {
                setQuery(value);
                setTimeout(
                  performSearch,
                  0
                );
              }}
            />

            <SearchExample
              title="Dashboard"
              query="dashboard"
              onSearch={(value) => {
                setQuery(value);
                setTimeout(
                  performSearch,
                  0
                );
              }}
            />

            <SearchExample
              title="TypeScript"
              query=".tsx"
              onSearch={(value) => {
                setQuery(value);
                setTimeout(
                  performSearch,
                  0
                );
              }}
            />

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

/* SEARCH EXAMPLE */

function SearchExample({
  title,
  query,
  onSearch,
}: {
  title: string;
  query: string;
  onSearch: (value: string) => void;
}) {
  return (
    <div className="dashboard-card">

      <div className="card-header">

        <div>

          <h2>
            {title}
          </h2>

          <p>
            Search for "{query}"
          </p>

        </div>

      </div>

      <div
        style={{
          padding:
            "20px 25px",
        }}
      >

        <button
          className="text-button"
          onClick={() =>
            onSearch(query)
          }
        >
          Search →
        </button>

      </div>

    </div>
  );
}
