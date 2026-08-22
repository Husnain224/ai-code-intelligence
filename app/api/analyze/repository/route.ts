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

  const totalLines = lines.length;

  const codeLines = lines.filter(
    (line) => line.trim() !== ""
  ).length;

  const todoCount = (
    code.match(/TODO|FIXME/gi) || []
  ).length;

  const consoleCount = (
    code.match(/console\.(log|error|warn|debug)/g) || []
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
    totalLines,
    codeLines,
    todoCount,
    consoleCount,
    longLines,
    functionCount,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repository are required" },
        { status: 400 }
      );
    }

    const octokit = new Octokit();

    // Get repository
    const repository = await octokit.rest.repos.get({
      owner,
      repo,
    });

    const branch = repository.data.default_branch;

    // Get branch commit
    const branchData = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });

    const commitSha = branchData.data.commit.sha;

    // Get all files
    const tree = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: commitSha,
      recursive: "true",
    });

    const sourceFiles = tree.data.tree.filter(
      (item) =>
        item.type === "blob" &&
        item.path &&
        SOURCE_EXTENSIONS.some((extension) =>
          item.path!.toLowerCase().endsWith(extension)
        )
    );

    const analyzedFiles = [];

    for (const file of sourceFiles.slice(0, 30)) {
      if (!file.path) continue;

      try {
        const response = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
          ref: branch,
        });

        if (
          Array.isArray(response.data) ||
          response.data.type !== "file" ||
          !response.data.content
        ) {
          continue;
        }

        const code = Buffer.from(
          response.data.content,
          "base64"
        ).toString("utf-8");

        const metrics = analyzeCode(code);

        analyzedFiles.push({
          path: file.path,
          ...metrics,
        });
      } catch {
        // Skip files that cannot be read
      }
    }

    const totalLines = analyzedFiles.reduce(
      (sum, file) => sum + file.codeLines,
      0
    );

    const totalTodos = analyzedFiles.reduce(
      (sum, file) => sum + file.todoCount,
      0
    );

    const totalConsole = analyzedFiles.reduce(
      (sum, file) => sum + file.consoleCount,
      0
    );

    return NextResponse.json({
      repository: `${owner}/${repo}`,
      branch,
      filesAnalyzed: analyzedFiles.length,
      totalLines,
      totalTodos,
      totalConsoleStatements: totalConsole,
      files: analyzedFiles,
    });
  } catch (error) {
    console.error("Repository Analysis Error:", error);

    return NextResponse.json(
      {
        error: "Repository analysis failed",
      },
      { status: 500 }
    );
  }
}