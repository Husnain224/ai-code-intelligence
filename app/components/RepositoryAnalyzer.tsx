"use client";

import { useState } from "react";

type AnalysisFile = {
  path: string;
  totalLines: number;
  codeLines: number;
  todoCount: number;
  consoleCount: number;
  longLines: number;
  functionCount: number;
};

type AnalysisResult = {
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

export default function RepositoryAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeRepository() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/analyze/full?owner=Husnain224&repo=ai-code-intelligence"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Repository analysis failed");
      }

      setAnalysis(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="analyzer-section">

      {/* HEADER */}

      <div className="analyzer-header">
        <div>
          <h2>Repository Analyzer</h2>

          <p>
            Analyze your GitHub repository using static code
            intelligence.
          </p>
        </div>

        <button
          className="primary-small"
          onClick={analyzeRepository}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Repository"}
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="analyzer-error">
          <strong>Analysis failed</strong>
          <p>{error}</p>
        </div>
      )}

      {/* EMPTY STATE */}

      {!analysis && !loading && !error && (
        <div className="analyzer-empty">
          <div className="analyzer-empty-icon">
            AI
          </div>

          <h3>Ready to analyze your repository</h3>

          <p>
            Click "Analyze Repository" to scan the GitHub
            repository and calculate code quality and bug risk.
          </p>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="analyzer-loading">
          <div className="loading-spinner"></div>

          <h3>Analyzing repository...</h3>

          <p>
            Fetching files and calculating code metrics.
          </p>
        </div>
      )}

      {/* RESULTS */}

      {analysis && !loading && (
        <div className="analysis-results">

          {/* SUMMARY */}

          <div className="analysis-summary">

            <div className="analysis-stat">
              <span>Files Analyzed</span>

              <strong>
                {analysis.summary.filesAnalyzed}
              </strong>
            </div>

            <div className="analysis-stat">
              <span>Total Lines</span>

              <strong>
                {analysis.summary.totalLines}
              </strong>
            </div>

            <div className="analysis-stat">
              <span>TODOs</span>

              <strong>
                {analysis.summary.totalTodos}
              </strong>
            </div>

            <div className="analysis-stat">
              <span>Console Statements</span>

              <strong>
                {analysis.summary.totalConsoleStatements}
              </strong>
            </div>

          </div>

          {/* SCORE */}

          <div className="analysis-score-card">

            <div>
              <span className="analysis-label">
                Code Quality
              </span>

              <div className="analysis-score">
                <strong>
                  {analysis.summary.qualityScore}
                </strong>

                <span>/100</span>
              </div>

              <p>
                {analysis.summary.qualityLabel}
              </p>
            </div>

            <div className="bug-risk-box">

              <span>Bug Risk</span>

              <strong>
                {analysis.summary.bugRisk}%
              </strong>

              <small>
                {analysis.summary.bugRisk < 20
                  ? "Low Risk"
                  : analysis.summary.bugRisk < 50
                  ? "Medium Risk"
                  : "High Risk"}
              </small>

            </div>

          </div>

          {/* FILE ANALYSIS */}

          <div className="analysis-files">

            <div className="analysis-files-header">

              <div>
                <h3>Analyzed Files</h3>

                <p>
                  Detailed metrics for each analyzed file.
                </p>
              </div>

              <span className="repository-branch">
                {analysis.branch}
              </span>

            </div>

            <div className="analysis-table">

              <div className="analysis-table-header">
                <span>FILE</span>
                <span>LINES</span>
                <span>FUNCTIONS</span>
                <span>TODO</span>
                <span>CONSOLE</span>
              </div>

              {analysis.files.map((file) => (
                <div
                  className="analysis-table-row"
                  key={file.path}
                >
                  <span className="analysis-file-name">
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
                      file.todoCount > 0
                        ? "warning-value"
                        : "normal-value"
                    }
                  >
                    {file.todoCount}
                  </span>

                  <span
                    className={
                      file.consoleCount > 0
                        ? "warning-value"
                        : "normal-value"
                    }
                  >
                    {file.consoleCount}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* RE-ANALYZE */}

          <div className="reanalyze-box">

            <div>
              <strong>
                Analysis completed successfully
              </strong>

              <p>
                Repository:
                {" "}
                {analysis.repository}
              </p>
            </div>

            <button
              className="header-button"
              onClick={analyzeRepository}
            >
              ↻ Re-analyze
            </button>

          </div>

        </div>
      )}

    </section>
  );
}