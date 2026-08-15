import Link from "next/link";
import {
  BrainCircuit,
  Bug,
  Code2,
  Search,
  ShieldCheck,
  GitBranch,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Code Intelligence",
    description:
      "Analyze complexity, maintainability, duplication, dependencies, and code quality.",
  },
  {
    icon: Bug,
    title: "Bug Prediction",
    description:
      "Use machine learning to identify files with a higher probability of future defects.",
  },
  {
    icon: ShieldCheck,
    title: "Security Analysis",
    description:
      "Detect vulnerable patterns, dangerous code, and dependency security issues.",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Search your entire repository using natural language instead of keywords.",
  },
  {
    icon: BrainCircuit,
    title: "AI Code Assistant",
    description:
      "Ask questions about your repository and receive answers based on your actual code.",
  },
  {
    icon: GitBranch,
    title: "Technical Debt",
    description:
      "Discover high-risk areas and prioritize engineering improvements.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <BrainCircuit size={22} />
            </div>

            <span className="text-lg font-bold">
              Code Intelligence
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-white"
            >
              How it works
            </a>

            <Link
              href="/dashboard"
              className="transition hover:text-white"
            >
              Dashboard
            </Link>
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              AI-Powered Software Intelligence
            </div>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              Understand your
              <br />

              <span className="text-blue-500">
                codebase intelligently.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              Analyze GitHub repositories, discover technical debt,
              predict potential bugs, detect security risks, and
              interact with your codebase using AI.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="group flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 py-3.5 font-medium transition hover:bg-blue-500"
              >
                Analyze Repository
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-slate-700 px-7 py-3.5 font-medium transition hover:bg-slate-900"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />

            <span className="ml-4 text-xs text-slate-500">
              Repository Intelligence
            </span>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-4">
            <Metric
              title="Code Quality"
              value="86%"
            />

            <Metric
              title="Security"
              value="92%"
            />

            <Metric
              title="Bug Risk"
              value="18%"
            />

            <Metric
              title="Technical Debt"
              value="Low"
            />
          </div>

          <div className="grid gap-6 border-t border-slate-800 p-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                Highest Risk Files
              </p>

              <div className="mt-5 space-y-5">
                <RiskFile
                  file="src/auth/service.ts"
                  risk="91%"
                />

                <RiskFile
                  file="src/payment/controller.ts"
                  risk="84%"
                />

                <RiskFile
                  file="src/user/repository.ts"
                  risk="67%"
                />

                <RiskFile
                  file="src/api/client.ts"
                  risk="43%"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                Repository Health
              </p>

              <div className="mt-6 flex h-40 items-end gap-2">
                {[45, 52, 48, 61, 57, 70, 68, 76, 82, 79, 88, 94].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t bg-blue-500/70"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="border-t border-slate-800"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-400">
              FEATURES
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Engineering intelligence for your codebase.
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              One platform for understanding code quality, security,
              architecture, technical debt, and software risks.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-t border-slate-800"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-400">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              From repository to intelligence
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            <Step
              number="01"
              title="Connect"
              description="Connect your GitHub repository securely."
            />

            <Step
              number="02"
              title="Analyze"
              description="Analyze source code, commits, dependencies, and project structure."
            />

            <Step
              number="03"
              title="Predict"
              description="Machine learning identifies risks and potential defects."
            />

            <Step
              number="04"
              title="Understand"
              description="Use dashboards, semantic search, and AI to understand your code."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-4xl font-bold">
            Ready to understand your codebase?
          </h2>

          <p className="mt-5 text-slate-400">
            Connect a repository and start analyzing your software.
          </p>

          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3.5 font-medium hover:bg-blue-500"
          >
            Start Analysis
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 AI Code Intelligence
          </p>

          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            Built for modern software engineering
          </div>
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
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function RiskFile({
  file,
  risk,
}: {
  file: string;
  risk: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="truncate text-sm text-slate-300">
        {file}
      </span>

      <span className="text-sm font-semibold text-red-400">
        {risk}
      </span>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-blue-500">
        {number}
      </p>

      <h3 className="mt-4 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}