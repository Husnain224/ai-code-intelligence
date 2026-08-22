import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

const SOURCE_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".cpp",
  ".c",
  ".cs",
  ".go",
  ".rs",
];

function analyzeCode(code: string) {
  const lines = code.split("\n");

  const codeLines = lines.filter(
    (line) => line.trim() !== ""
  ).length;

  const todoCount = (
    code.match(/TODO|FIXME/gi) || []
  ).length;

  const consoleCount = (
    code.match(
      /console\.(log|error|warn|debug)/g
    ) || []
  ).length;

  const longLines = lines.filter(
    (line) => line.length > 100
  ).length;

  const functionCount = (
    code.match(
      /\b(function|const|let)\s+\w+\s*(=|\()/g
    ) || []
  ).length;

  return {
    totalLines: lines.length,
    codeLines,
    todoCount,
    consoleCount,
    longLines,
    functionCount,
  };
}

function calculateQualityScore(
  files: ReturnType<typeof analyzeCode>[],
  totalTodos: number,
  totalConsole: number
) {
  let score = 100;

  score -= Math.min(
    totalTodos * 2,
    15
  );

  score -= Math.min(
    totalConsole * 1.5,
    10
  );

  const longLines = files.reduce(
    (sum, file) =>
      sum + file.longLines,
    0
  );

  score -= Math.min(
    longLines * 0.5,
    10
  );

  const largeFiles = files.filter(
    (file) => file.codeLines > 300
  ).length;

  score -= Math.min(
    largeFiles * 3,
    15
  );

  return Math.max(
    0,
    Math.round(score)
  );
}

function getQualityLabel(
  score: number
) {
  if (score >= 90)
    return "Excellent";

  if (score >= 75)
    return "Good";

  if (score >= 60)
    return "Needs Improvement";

  return "Poor";
}

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const owner =
      searchParams.get("owner");

    const repo =
      searchParams.get("repo");

    if (!owner || !repo) {
      return NextResponse.json(
        {
          error:
            "Owner and repository are required",
        },
        { status: 400 }
      );
    }

    const octokit = new Octokit();

    /*
      STEP 1
      Get repository
    */

    const repository =
      await octokit.rest.repos.get({
        owner,
        repo,
      });

    const branch =
      repository.data.default_branch;

    /*
      STEP 2
      Get branch
    */

    const branchData =
      await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch,
      });

    const commitSha =
      branchData.data.commit.sha;

    /*
      STEP 3
      Get repository tree
    */

    const tree =
      await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: commitSha,
        recursive: "true",
      });

    /*
      STEP 4
      Find source files
    */

    const sourceFiles =
      tree.data.tree.filter(
        (item) =>
          item.type === "blob" &&
          item.path &&
          SOURCE_EXTENSIONS.some(
            (extension) =>
              item.path!
                .toLowerCase()
                .endsWith(extension)
          )
      );

    /*
      IMPORTANT:
      Only analyze 3 files.
      This keeps the project fast.
    */

    const selectedFiles =
      sourceFiles.slice(0, 3);

    /*
      STEP 5
      Download files
    */

    const results =
      await Promise.all(
        selectedFiles.map(
          async (file) => {
            if (!file.path) {
              return null;
            }

            try {
              const response =
                await octokit.rest.repos.getContent(
                  {
                    owner,
                    repo,
                    path: file.path,
                    ref: branch,
                  }
                );

              if (
                Array.isArray(
                  response.data
                )
              ) {
                return null;
              }

              if (
                response.data.type !==
                "file"
              ) {
                return null;
              }

              if (
                !response.data.content
              ) {
                return null;
              }

              const code =
                Buffer.from(
                  response.data.content,
                  "base64"
                ).toString("utf-8");

              /*
                Don't analyze huge files.
              */

              if (
                code.length > 200000
              ) {
                return null;
              }

              const metrics =
                analyzeCode(code);

              return {
                path: file.path,
                ...metrics,
              };
            } catch {
              return null;
            }
          }
        )
      );

    const analyzedFiles =
      results.filter(
        (
          file
        ): file is NonNullable<
          typeof file
        > => file !== null
      );

    /*
      STEP 6
      Calculate totals
    */

    const totalLines =
      analyzedFiles.reduce(
        (sum, file) =>
          sum + file.totalLines,
        0
      );

    const totalTodos =
      analyzedFiles.reduce(
        (sum, file) =>
          sum + file.todoCount,
        0
      );

    const totalConsole =
      analyzedFiles.reduce(
        (sum, file) =>
          sum + file.consoleCount,
        0
      );

    /*
      STEP 7
      Quality
    */

    const qualityScore =
      calculateQualityScore(
        analyzedFiles,
        totalTodos,
        totalConsole
      );

    const bugRisk =
      100 - qualityScore;

    /*
      STEP 8
      Return result
    */

    return NextResponse.json({
      repository:
        `${owner}/${repo}`,

      branch,

      summary: {
        filesAnalyzed:
          analyzedFiles.length,

        totalLines,

        totalTodos,

        totalConsoleStatements:
          totalConsole,

        qualityScore,

        qualityLabel:
          getQualityLabel(
            qualityScore
          ),

        bugRisk,
      },

      files:
        analyzedFiles,
    });
  } catch (error) {
    console.error(
      "Full Analysis Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "GitHub API request failed. Your GitHub API quota may be exhausted.",
      },
      {
        status: 500,
      }
    );
  }
}