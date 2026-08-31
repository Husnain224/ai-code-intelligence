const riskFiles = [
  ["src/auth/service.ts", "91%"],
  ["src/payment/controller.ts", "84%"],
  ["src/user/repository.ts", "67%"],
  ["src/api/client.ts", "43%"],
];

const features = [
  {
    icon: "AI",
    title: "AI-Powered Analysis",
    description:
      "Analyze your GitHub repository using machine learning and intelligent code metrics.",
  },
  {
    icon: "SEC",
    title: "Security Analysis",
    description:
      "Identify security risks and potentially vulnerable areas in your codebase.",
  },
  {
    icon: "BUG",
    title: "Bug Prediction",
    description:
      "Predict the probability that a code change may introduce bugs.",
  },
  {
    icon: "CODE",
    title: "Code Quality",
    description:
      "Understand repository health, code quality, complexity, and technical debt.",
  },
];

const steps = [
  {
    number: "01",
    title: "Connect GitHub",
    description: "Connect your GitHub repository to AI Code Intelligence.",
  },
  {
    number: "02",
    title: "Analyze Code",
    description:
      "Our system analyzes repository files, commits, security, and code quality.",
  },
  {
    number: "03",
    title: "Get Intelligence",
    description:
      "View actionable insights, risk scores, and AI-powered predictions.",
  },
];

export default function Home() {
  return (
    <main className="landing-page">
      {/* ================= HERO ================= */}

      <section className="hero-section">
        <nav className="navbar">
          <div className="brand">
            <div className="brand-icon">AI</div>
            <span>AI Code Intelligence</span>
          </div>

          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#preview">Preview</a>
          </div>

          <a href="/dashboard" className="nav-button">
            Open Dashboard →
          </a>
        </nav>

        <div className="hero-content container">
          <div className="hero-badge">
            <span>●</span> AI-powered GitHub intelligence
          </div>

          <h1>
            Understand your code.
            <br />
            <span>Predict what comes next.</span>
          </h1>

          <p>
            AI Code Intelligence analyzes your GitHub repositories to identify
            code quality issues, security risks, technical debt, and potential
            bugs before they become problems.
          </p>

          <div className="hero-actions">
            <a href="/dashboard" className="hero-primary">
              Analyze Repository →
            </a>

            <a href="#preview" className="hero-secondary">
              See how it works
            </a>
          </div>

          <div className="hero-trust">
            <span>✓ GitHub Integration</span>
            <span>✓ Machine Learning</span>
            <span>✓ Security Analysis</span>
            <span>✓ Bug Prediction</span>
          </div>
        </div>
      </section>

      {/* ================= PRODUCT PREVIEW ================= */}

      <section className="preview-section" id="preview">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">REPOSITORY INTELLIGENCE</p>

            <h2>
              Everything you need to
              <br />
              understand your codebase.
            </h2>

            <p>
              Get a complete picture of your repository health from a single
              intelligent dashboard.
            </p>
          </div>

          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="window-controls">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <p>Repository Intelligence</p>
            </div>

            <div className="metrics">
              <Metric title="Code Quality" value="86%" />
              <Metric title="Security" value="92%" />
              <Metric title="Bug Risk" value="18%" />
              <Metric title="Technical Debt" value="Low" />
            </div>

            <div className="preview-content">
              <div className="preview-panel">
                <h3>Highest Risk Files</h3>

                <div className="risk-list">
                  {riskFiles.map(([file, risk]) => (
                    <div className="risk-item" key={file}>
                      <span>{file}</span>
                      <strong>{risk}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-panel">
                <h3>Repository Health</h3>

                <div className="chart">
                  {[45, 52, 48, 61, 57, 70, 68, 76, 82, 79, 88, 94].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="chart-bar"
                        style={{ height: `${height}%` }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="features-section" id="features">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">FEATURES</p>

            <h2>
              Intelligent insights for
              <br />
              modern development.
            </h2>

            <p>
              Turn your GitHub repository data into useful engineering
              intelligence.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <span className="feature-arrow">Learn more →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">HOW IT WORKS</p>

            <h2>
              From repository to
              <br />
              actionable intelligence.
            </h2>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <div className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div>
              <p className="section-eyebrow">READY TO START?</p>

              <h2>Make your repository smarter.</h2>

              <p>
                Connect your GitHub repository and discover what your code is
                telling you.
              </p>
            </div>

            <a href="/dashboard" className="cta-button">
              Open Dashboard →
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <div className="container footer-content">
          <div className="brand">
            <div className="brand-icon">AI</div>
            <span>AI Code Intelligence</span>
          </div>

          <p>AI-powered GitHub repository analysis.</p>

          <span>© 2026 AI Code Intelligence</span>
        </div>
      </footer>
    </main>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="metric">
      <p>{title}</p>
      <strong>{value}</strong>
    </div>
  );
}