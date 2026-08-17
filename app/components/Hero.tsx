import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow"></div>

      <div className="container hero-content">
        <div className="hero-badge">
          <span className="status-dot"></span>
          AI-Powered Software Intelligence
        </div>

        <h1>
          Understand your
          <span> codebase intelligently.</span>
        </h1>

        <p>
          Analyze GitHub repositories, discover technical debt,
          predict potential bugs, detect security risks, and
          interact with your codebase using AI.
        </p>

        <div className="hero-actions">
          <Link href="/dashboard" className="primary-button">
            Analyze Repository →
          </Link>

          <a href="#features" className="secondary-button">
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
}