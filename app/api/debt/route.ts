
import { NextRequest, NextResponse } from "next/server";

const OWNER = "Husnain224";
const REPO = "ai-code-intelligence";

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

type DebtFile = {
  path: string;
  debtScore: number;
  estimatedHours: number;
  totalLines: number;
  longLines: number;
  functions: number;
  todos: number;
  consoleStatements: number;
};

async function getRepositoryAnalysis(): Promise<AnalysisData> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/analyze/full?owner=${OWNER}&repo=${REPO}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Could not load repository analysis"
    );
  }

  return response.json();
}

/*
 * Calculate technical debt for one file.
 *
 * This is an engineering heuristic.
 * It is NOT an ML model.
 */
function calculateFileDebt(
  file: FileData
): DebtFile {
  let score = 0;

  /*
   * Long lines
   */
  score += file.longLines * 3;

  /*
   * Functions
   */
  if (file.functionCount > 5) {
    score +=
      (file.functionCount - 5) * 4;
  }

  /*
   * TODO / FIXME
   */
  score += file.todoCount * 8;

  /*
   * Console statements
   */
  score += file.consoleCount * 3;

  /*
   * Large source files
   */
  if (file.codeLines > 300) {
    score += 15;
  }

  if (file.codeLines > 500) {
    score += 15;
  }

  if (file.codeLines > 800) {
    score += 20;
  }

  /*
   * Cap score
   */
  const debtScore = Math.min(
    Math.round(score),
    100
  );

  /*
   * Estimate engineering hours.
   *
   * This is intentionally conservative:
   * every 10 debt points ≈ 1 hour.
   */
  const estimatedHours = Number(
    Math.max(
      debtScore / 10,
      0
    ).toFixed(1)
  );

  return {
    path: file.path,
    debtScore,
    estimatedHours,
    totalLines: file.totalLines,
    longLines: file.longLines,
    functions: file.functionCount,
    todos: file.todoCount,
    consoleStatements: file.consoleCount,
  };
}

function getDebtLabel(
  score: number
): string {
  if (score < 20) {
    return "Low";
  }

  if (score < 40) {
    return "Moderate";
  }

  if (score < 60) {
    return "Medium";
  }

  if (score < 80) {
    return "High";
  }

  return "Critical";
}

export async function GET(
  request: NextRequest
) {
  try {
    /*
     * Get repository analysis.
     */
    const analysis =
      await getRepositoryAnalysis();

    /*
     * Calculate debt for every file.
     */
    const debtFiles =
      analysis.files
        .map(calculateFileDebt)
        .sort(
          (a, b) =>
            b.debtScore -
            a.debtScore
        );

    /*
     * Total estimated debt.
     */
    const totalEstimatedHours =
      debtFiles.reduce(
        (total, file) =>
          total +
          file.estimatedHours,
        0
      );

    /*
     * Average debt score.
     */
    const averageDebtScore =
      debtFiles.length > 0
        ? debtFiles.reduce(
            (total, file) =>
              total +
              file.debtScore,
            0
          ) / debtFiles.length
        : 0;

    const debtScore = Math.round(
      averageDebtScore
    );

    /*
     * Debt label.
     */
    const debtLabel =
      getDebtLabel(debtScore);

    /*
     * Category calculations.
     */
    const todoHours = Number(
      (
        analysis.summary.totalTodos *
        0.5
      ).toFixed(1)
    );

    const consoleHours = Number(
      (
        analysis.summary
          .totalConsoleStatements *
        0.25
      ).toFixed(1)
    );

    const longLineCount =
      analysis.files.reduce(
        (total, file) =>
          total +
          file.longLines,
        0
      );

    const longLineHours = Number(
      (
        longLineCount *
        0.1
      ).toFixed(1)
    );

    const complexityHours = Number(
      debtFiles
        .reduce(
          (total, file) =>
            total +
            Math.max(
              file.functions - 5,
              0
            ) *
              0.5,
          0
        )
        .toFixed(1)
    );

    const largeFileCount =
      analysis.files.filter(
        (file) =>
          file.codeLines > 300
      ).length;

    const largeFileHours = Number(
      (
        largeFileCount *
        2
      ).toFixed(1)
    );

    /*
     * Return complete technical debt report.
     */
    return NextResponse.json({
      repository:
        analysis.repository,

      branch:
        analysis.branch,

      summary: {
        debtScore,
        debtLabel,

        estimatedHours:
          Number(
            totalEstimatedHours.toFixed(
              1
            )
          ),

        filesAnalyzed:
          analysis.summary
            .filesAnalyzed,

        totalLines:
          analysis.summary
            .totalLines,

        totalTodos:
          analysis.summary
            .totalTodos,

        totalConsoleStatements:
          analysis.summary
            .totalConsoleStatements,
      },

      categories: {
        todos: {
          count:
            analysis.summary
              .totalTodos,
          estimatedHours:
            todoHours,
        },

        consoleStatements: {
          count:
            analysis.summary
              .totalConsoleStatements,
          estimatedHours:
            consoleHours,
        },

        longLines: {
          count:
            longLineCount,
          estimatedHours:
            longLineHours,
        },

        complexity: {
          estimatedHours:
            complexityHours,
        },

        largeFiles: {
          count:
            largeFileCount,
          estimatedHours:
            largeFileHours,
        },
      },

      highDebtFiles:
        debtFiles.slice(0, 10),

      allFiles:
        debtFiles,

      recommendations: [
        "Refactor files with the highest debt score first.",
        "Resolve TODO and FIXME comments.",
        "Break large files into smaller modules.",
        "Reduce excessive function complexity.",
        "Remove unnecessary console statements.",
        "Break long lines and improve readability.",
        "Add automated tests before major refactoring.",
      ],

      methodology: {
        description:
          "Technical debt is estimated using static repository metrics.",

        metrics: [
          "Long lines",
          "Function count",
          "TODO/FIXME comments",
          "Console statements",
          "Large files",
        ],

        note:
          "Estimated hours are heuristic engineering estimates, not measured historical development time.",
      },
    });
  } catch (error) {
    console.error(
      "Technical Debt API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not calculate technical debt.",
      },
      {
        status: 500,
      }
    );
  }
}