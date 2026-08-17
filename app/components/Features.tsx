const features = [
  {
    icon: "⌘",
    title: "Code Intelligence",
    description:
      "Analyze complexity, maintainability, duplication, dependencies, and code quality.",
  },
  {
    icon: "◈",
    title: "Bug Prediction",
    description:
      "Use machine learning to identify files with a higher probability of future defects.",
  },
  {
    icon: "◇",
    title: "Security Analysis",
    description:
      "Detect vulnerable patterns, dangerous code, and dependency security issues.",
  },
  {
    icon: "⌕",
    title: "Semantic Search",
    description:
      "Search your entire repository using natural language instead of keywords.",
  },
  {
    icon: "✦",
    title: "AI Code Assistant",
    description:
      "Ask questions about your repository and receive answers based on your actual code.",
  },
  {
    icon: "△",
    title: "Technical Debt",
    description:
      "Discover high-risk areas and prioritize engineering improvements.",
  },
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-heading">
          <span>FEATURES</span>

          <h2>Engineering intelligence for your codebase.</h2>

          <p>
            One platform for understanding code quality,
            security, architecture, technical debt, and
            software risks.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}