import { NextRequest, NextResponse } from "next/server";

function calculateScore(metrics: {
  totalLines: number;
  totalTodos: number;
  totalConsoleStatements: number;
  files: {
    longLines: number;
    functionCount: number;
    codeLines: number;
  }[];
}) {
  let score = 100;

  // TODO/FIXME penalty
  score -= Math.min(metrics.totalTodos * 2, 15);

  // console/debug penalty
  score -= Math.min(metrics.totalConsoleStatements * 1.5, 10);

  // Long-line penalty
  const longLines = metrics.files.reduce(
    (sum, file) => sum + file.longLines,
    0
  );

  score -= Math.min(longLines * 0.5, 10);

  // Large-function penalty
  const largeFunctions = metrics.files.reduce(
    (sum, file) => {
      if (file.codeLines > 300) {
        return sum + 2;
      }

      return sum;
    },
    0
  );

  score -= Math.min(largeFunctions * 3, 15);

  score = Math.max(0, Math.round(score));

  return score;
}

function getQualityLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Needs Improvement";

  return "Poor";
}

function calculateBugRisk(score: number) {
  return Math.max(0, 100 - score);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { totalLines, totalTodos, totalConsoleStatements, files } =
      body;

    if (!files) {
      return NextResponse.json(
        { error: "Analysis metrics are required" },
        { status: 400 }
      );
    }

    const qualityScore = calculateScore({
      totalLines,
      totalTodos,
      totalConsoleStatements,
      files,
    });

    const bugRisk = calculateBugRisk(qualityScore);

    return NextResponse.json({
      qualityScore,
      qualityLabel: getQualityLabel(qualityScore),
      bugRisk,
      metrics: {
        totalLines,
        totalTodos,
        totalConsoleStatements,
        filesAnalyzed: files.length,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Score calculation failed" },
      { status: 500 }
    );
  }
}