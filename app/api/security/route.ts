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

type SecurityIssue = {
  file: string;
  line: number;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  message: string;
  code: string;
};

function scanCode(
  code: string,
  filePath: string
): SecurityIssue[] {
  const issues: SecurityIssue[] = [];

  const lines = code.split("\n");

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();

    // Hardcoded password
    if (
      /(password|passwd|pwd)\s*[:=]\s*["'][^"']+["']/i.test(
        line
      )
    ) {
      issues.push({
        file: filePath,
        line: lineNumber,
        type: "Hardcoded Password",
        severity: "High",
        message:
          "A possible hardcoded password was detected.",
        code: trimmed,
      });
    }

    // API key
    if (
      /(api[_-]?key|apikey)\s*[:=]\s*["'][^"']+["']/i.test(
        line
      )
    ) {
      issues.push({
        file: filePath,
        line: lineNumber,
        type: "Hardcoded API Key",
        severity: "Critical",
        message:
          "A possible hardcoded API key was detected.",
        code: trimmed,
      });
    }

    // Secret
    if (
      /(secret|client_secret)\s*[:=]\s*["'][^"']+["']/i.test(
        line
      )
    ) {
      issues.push({
        file: filePath,
        line: lineNumber,
        type: "Hardcoded Secret",
        severity: "Critical",
        message:
          "A possible hardcoded secret was detected.",
        code: trimmed,
      });
    }

    // Private key
    if (
      line.includes("-----BEGIN PRIVATE KEY-----") ||
      line.includes("-----BEGIN RSA PRIVATE KEY-----")
    ) {
      issues.push({
        file: filePath,
        line: lineNumber,
        type: "Private Key",
        severity: "Critical",
        message:
          "A private cryptographic key may be exposed.",
        code: trimmed,
      });
    }

    // eval()
    if (/\beval\s*\(/.test(line)) {
      issues.push({
        file: filePath,
        line: lineNumber,
        type: "Dangerous eval()",
        severity: "High",
        message:
          "eval() can execute dynamically generated code.",
        code: trimmed,
      });
    }

    // innerHTML
    if (/innerHTML\s*=/.test(line)) {
      issues.push({
        file: filePath,
        line: lineNumber,
        type: "Potential XSS",
        severity: "High",
        message:
          "Direct innerHTML assignment may introduce XSS.",
        code: trimmed,
      });
    }

    // dangerouslySetInnerHTML
    if (line.includes("dangerouslySetInnerHTML")) {
      issues.push({
        file: filePath,
        line: lineNumber,
        type: "Potential XSS",
        severity: "High",
        message:
          "dangerouslySetInnerHTML should only be used with trusted or sanitized content.",
        code: trimmed,
      });
    }

    // Insecure HTTP
    if (
      /http:\/\//i.test(line) &&
      !line.includes("localhost")
    ) {
      issues.push({
        file: filePath,
        line: lineNumber,
        type: "Insecure HTTP",
        severity: "Medium",
        message:
          "An unencrypted HTTP URL was detected.",
        code: trimmed,
      });
    }

    // Possible SQL injection
    if (
      /(SELECT|INSERT|UPDATE|DELETE).*(\+|\$\{)/i.test(
        line
      )
    ) {
      issues.push({
        file: filePath,
        line: lineNumber,
        type: "Possible SQL Injection",
        severity: "High",
        message:
          "SQL appears to be constructed using string concatenation.",
        code: trimmed,
      });
    }

    // Command execution
    if (
      /\b(exec|execSync|spawn|system)\s*\(/.test(
        line
      )
    ) {
      issues.push({
        file: filePath,
        line: lineNumber,
        type: "Command Execution",
        severity: "High",
        message:
          "Dynamic command execution can be dangerous when user input is involved.",
        code: trimmed,
      });
    }
  });

  return issues;
}

function calculateSecurityScore(
  issues: SecurityIssue[]
) {
  let score = 100;

  const critical = issues.filter(
    (issue) => issue.severity === "Critical"
  ).length;

  const high = issues.filter(
    (issue) => issue.severity === "High"
  ).length;

  const medium = issues.filter(
    (issue) => issue.severity === "Medium"
  ).length;

  const low = issues.filter(
    (issue) => issue.severity === "Low"
  ).length;

  score -= critical * 20;
  score -= high * 10;
  score -= medium * 5;
  score -= low * 2;

  return Math.max(
    0,
    Math.min(100, Math.round(score))
  );
}

function getSecurityLabel(score: number) {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 75) {
    return "Good";
  }

  if (score >= 50) {
    return "Needs Attention";
  }

  return "Critical";
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
            "Owner and repository are required.",
        },
        {
          status: 400,
        }
      );
    }

    const octokit = new Octokit();

    // Get repository
    const repository =
      await octokit.rest.repos.get({
        owner,
        repo,
      });

    const branch =
      repository.data.default_branch;

    // Get latest branch
    const branchData =
      await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch,
      });

    const commitSha =
      branchData.data.commit.sha;

    // Get repository tree
    const tree =
      await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: commitSha,
        recursive: "true",
      });

    // Find source files
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

    // Keep scan fast
    const selectedFiles =
      sourceFiles.slice(0, 10);

    // Download files in parallel
    const results =
      await Promise.all(
        selectedFiles.map(
          async (file) => {
            if (!file.path) {
              return [];
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
                Array.isArray(response.data) ||
                response.data.type !== "file" ||
                !response.data.content
              ) {
                return [];
              }

              const code =
                Buffer.from(
                  response.data.content,
                  "base64"
                ).toString("utf-8");

              // Ignore very large files
              if (code.length > 200000) {
                return [];
              }

              return scanCode(
                code,
                file.path
              );
            } catch {
              return [];
            }
          }
        )
      );

    const issues =
      results.flat();

    const critical =
      issues.filter(
        (issue) =>
          issue.severity === "Critical"
      ).length;

    const high =
      issues.filter(
        (issue) =>
          issue.severity === "High"
      ).length;

    const medium =
      issues.filter(
        (issue) =>
          issue.severity === "Medium"
      ).length;

    const low =
      issues.filter(
        (issue) =>
          issue.severity === "Low"
      ).length;

    const securityScore =
      calculateSecurityScore(issues);

    const securityLabel =
      getSecurityLabel(
        securityScore
      );

    return NextResponse.json({
      repository: `${owner}/${repo}`,

      branch,

      summary: {
        filesScanned:
          selectedFiles.length,

        totalIssues:
          issues.length,

        critical,

        high,

        medium,

        low,

        securityScore,

        securityLabel,
      },

      issues,
    });
  } catch (error) {
    console.error(
      "Security Scan Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Security scan failed.",
      },
      {
        status: 500,
      }
    );
  }
}