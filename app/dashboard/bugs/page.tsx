"use client";

import { useState } from "react";

export default function BugPredictionPage() {
  const [filesChanged, setFilesChanged] = useState("5");
  const [additions, setAdditions] = useState("100");
  const [deletions, setDeletions] = useState("20");
  const [totalChanges, setTotalChanges] = useState("120");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function predictBug() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/bug-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filesChanged: Number(filesChanged),
          additions: Number(additions),
          deletions: Number(deletions),
          totalChanges: Number(totalChanges),
        }),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `API returned invalid response: ${text.substring(0, 200)}`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Prediction failed"
        );
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-blue-600">
            Workspace / Bug Prediction
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Bug Prediction
          </h1>

          <p className="mt-2 text-slate-500">
            Predict the probability that a code change may
            introduce bugs using machine learning.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Input Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Commit Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter commit statistics to calculate bug risk.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">
                AI
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Files */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Files Changed
                </label>

                <input
                  type="number"
                  min="0"
                  value={filesChanged}
                  onChange={(e) =>
                    setFilesChanged(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Additions */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Lines Added
                </label>

                <input
                  type="number"
                  min="0"
                  value={additions}
                  onChange={(e) =>
                    setAdditions(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Deletions */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Lines Deleted
                </label>

                <input
                  type="number"
                  min="0"
                  value={deletions}
                  onChange={(e) =>
                    setDeletions(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Total */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Total Changes
                </label>

                <input
                  type="number"
                  min="0"
                  value={totalChanges}
                  onChange={(e) =>
                    setTotalChanges(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                />
              </div>

            </div>

            {/* Button */}
            <button
              onClick={predictBug}
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-slate-950 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Analyzing..."
                : "Predict Bug Risk →"}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

          </div>

          {/* Result Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Prediction Result
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Machine learning analysis of the commit.
              </p>
            </div>

            {!result && !loading && (
              <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                  ◇
                </div>

                <h3 className="text-lg font-bold text-slate-950">
                  No prediction yet
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Enter commit information and click
                  Predict Bug Risk.
                </p>

              </div>
            )}

            {loading && (
              <div className="flex min-h-[350px] flex-col items-center justify-center">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />

                <p className="font-medium text-slate-600">
                  Analyzing commit...
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="mt-8">

                {/* Risk */}
                <div className="rounded-2xl bg-slate-50 p-6 text-center">

                  <p className="text-sm font-medium text-slate-500">
                    Bug Risk
                  </p>

                  <p className="mt-2 text-6xl font-bold text-slate-950">
                    {result.bugRisk}%
                  </p>

                  <p className="mt-3 text-xl font-bold text-slate-700">
                    {result.label}
                  </p>

                </div>

                {/* Features */}
                <div className="mt-6">
                  <h3 className="mb-4 font-bold text-slate-950">
                    Commit Statistics
                  </h3>

                  <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Files Changed
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {result.features.filesChanged}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Lines Added
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {result.features.additions}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Lines Deleted
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {result.features.deletions}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Total Changes
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {result.features.totalChanges}
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </main>
  );
}