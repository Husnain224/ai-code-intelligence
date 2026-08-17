import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link href="/" className="logo">
          <div className="logo-icon">AI</div>
          <span>Code Intelligence</span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link href="/dashboard">Dashboard</Link>
        </div>

        <Link href="/dashboard" className="nav-button">
          Get Started
        </Link>
      </div>
    </nav>
  );
}