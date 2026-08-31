
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
      "Could not analyze repository"
    );
  }

  return response.json();
}

function generateAnswer(
  question: string,
  analysis: AnalysisData
) {
  const q = question.toLowerCase();

  const summary = analysis.summary;
  const files = analysis.files;

  /*
   * QUESTION: CODE QUALITY
   */

  if (
    q.includes("quality") ||
    q.includes("code quality")
  ) {
    return `
Your repository currently has a code quality score of ${summary.qualityScore}/100.

Quality level: ${summary.qualityLabel}

Repository statistics:
• Files analyzed: ${summary.filesAnalyzed}
• Total lines: ${summary.totalLines}
• TODO/FIXME items: ${summary.totalTodos}
• Console statements: ${summary.totalConsoleStatements}
• Bug risk: ${summary.bugRisk}%

Overall, the repository is currently in good shape.

The next improvement areas should be:
1. Reduce long lines.
2. Keep large files modular.
3. Reduce unnecessary console statements.
4. Add automated testing.
5. Add security analysis.
`.trim();
  }

  /*
   * QUESTION: BUGS
   */

  if (
    q.includes("bug") ||
    q.includes("bugs") ||
    q.includes("problem")
  ) {
    const riskyFiles = [...files]
      .sort(
        (a, b) =>
          calculateRisk(b) -
          calculateRisk(a)
      )
      .slice(0, 5);

    const fileList =
      riskyFiles.length > 0
        ? riskyFiles
            .map(
              (file, index) =>
                `${index + 1}. ${file.path} — risk ${calculateRisk(
                  file
                )}%`
            )
            .join("\n")
        : "No files available.";

    return `
I analyzed the repository for potential problem areas.

Current bug-risk score: ${summary.bugRisk}%

Potentially risky files:

${fileList}

Important note:
This is currently a static code-analysis risk score. It is not yet a machine-learning bug prediction model.

The next version can use historical commits and machine learning to predict which files are most likely to contain bugs.
`.trim();
  }

  /*
   * QUESTION: REFACTOR
   */

  if (
    q.includes("refactor") ||
    q.includes("improve")
  ) {
    const filesToRefactor = [...files]
      .sort(
        (a, b) =>
          calculateRisk(b) -
          calculateRisk(a)
      )
      .slice(0, 5);

    const list =
      filesToRefactor.length > 0
        ? filesToRefactor
            .map((file) => {
              return `• ${file.path}
  Lines: ${file.totalLines}
  Functions: ${file.functionCount}
  Long lines: ${file.longLines}
  TODOs: ${file.todoCount}
  Console statements: ${file.consoleCount}`;
            })
            .join("\n\n")
        : "No files available.";

    return `
Here are the files I would investigate first:

${list}

Recommended refactoring strategy:

1. Start with the highest-risk file.
2. Break large components into smaller components.
3. Move reusable logic into utility functions.
4. Remove unnecessary console statements.
5. Add tests before major refactoring.
6. Refactor one module at a time.
`.trim();
  }

  /*
   * QUESTION: FILES
   */

  if (
    q.includes("file") ||
    q.includes("files")
  ) {
    const fileList =
      files.length > 0
        ? files
            .map(
              (file) =>
                `• ${file.path} — ${file.totalLines} lines`
            )
            .join("\n")
        : "No files found.";

    return `
I found ${files.length} analyzed files in the repository.

${fileList}

Total repository lines analyzed:
${summary.totalLines}
`.trim();
  }

  /*
   * QUESTION: SECURITY
   */

  if (
    q.includes("security") ||
    q.includes("vulnerability") ||
    q.includes("secure")
  ) {
    return `
Security analysis is the next major capability we should add.

The current analyzer does not yet perform a complete security scan.

A production version should detect:

• Hardcoded secrets
• API keys
• Unsafe eval usage
• SQL injection patterns
• Command injection
• XSS risks
• Insecure dependencies
• Authentication problems
• Authorization problems

Your current dashboard's Security section can therefore be considered "coming soon" until we implement these checks.
`.trim();
  }

  /*
   * QUESTION: TECHNICAL DEBT
   */

  if (
    q.includes("technical debt") ||
    q.includes("debt")
  ) {
    return `
Technical debt analysis is not fully implemented yet.

However, we can already identify some useful indicators:

• Long lines
• Large files
• High function counts
• TODO/FIXME comments
• Console statements

Current indicators:

TODO/FIXME:
${summary.totalTodos}

Console statements:
${summary.totalConsoleStatements}

Total lines:
${summary.totalLines}

The next step is to convert these measurements into estimated technical-debt hours.
`.trim();
  }

  /*
   * QUESTION: SUMMARY
   */

  if (
    q.includes("summary") ||
    q.includes("repository") ||
    q.includes("project")
  ) {
    return `
Repository: ${summaryRepository(
      analysis
    )}

Branch: ${analysis.branch}

Repository summary:

• ${summary.filesAnalyzed} files analyzed
• ${summary.totalLines} total lines
• Quality score: ${summary.qualityScore}/100
• Quality: ${summary.qualityLabel}
• Bug risk: ${summary.bugRisk}%
• TODO/FIXME: ${summary.totalTodos}
• Console statements: ${summary.totalConsoleStatements}

The repository is currently in a healthy state, but security analysis, technical-debt estimation, and ML-based bug prediction still need to be implemented.
`.trim();
  }

  /*
   * DEFAULT ANSWER
   */

  return `
I understand your question:

"${question}"

Based on the current repository analysis:

• Quality score: ${summary.qualityScore}/100
• Bug risk: ${summary.bugRisk}%
• Files analyzed: ${summary.filesAnalyzed}
• Total lines: ${summary.totalLines}

You can ask me questions such as:

• "What is my code quality?"
• "What are the biggest problems?"
• "Which files should I refactor?"
• "Show me the repository files"
• "What is the security status?"
• "How much technical debt do I have?"
• "Give me a repository summary"

More advanced AI code understanding will be added next.
`.trim();
}

function calculateRisk(
  file: FileData
) {
  let risk = 0;

  risk +=
    file.longLines * 10;

  risk +=
    file.functionCount * 5;

  risk +=
    file.todoCount * 10;

  risk +=
    file.consoleCount * 5;

  if (file.codeLines > 300) {
    risk += 20;
  }

  return Math.min(
    Math.round(risk),
    100
  );
}

function summaryRepository(
  analysis: AnalysisData
) {
  return analysis.repository;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const question =
      body?.question;

    if (
      !question ||
      typeof question !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Question is required",
        },
        {
          status: 400,
        }
      );
    }

    const analysis =
      await getRepositoryAnalysis();

    const answer =
      generateAnswer(
        question,
        analysis
      );

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error(
      "AI Assistant Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "AI Assistant could not process the request.",
      },
      {
        status: 500,
      }
    );
  }
}