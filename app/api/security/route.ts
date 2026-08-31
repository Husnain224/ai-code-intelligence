import { NextRequest, NextResponse } from "next/server";

const DEFAULT_OWNER = "Husnain224";
const DEFAULT_REPO = "ai-code-intelligence";
const DEFAULT_BRANCH = "main";

type SecurityIssue = {
  file: string;
  line: number;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  message: string;
  code: string;
};

type SecurityResult = {
  repository: string;
  branch: string;

  summary: {
    securityScore: number;
    riskLevel: string;
    filesScanned: number;
    issuesFound: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };

  issues: SecurityIssue[];
};

function getSeverityWeight(
  severity: SecurityIssue["severity"]
) {
  switch (severity) {
    case "Critical":
      return 30;

    case "High":
      return 20;

    case "Medium":
      return 10;

    case "Low":
      return 5;

    default:
      return 0;
  }
}

function calculateSecurityScore(
  issues: SecurityIssue[]
) {
  let risk = 0;

  for (const issue of issues) {
    risk += getSeverityWeight(issue.severity);
  }

  return Math.max(
    0,
    Math.min(100, 100 - risk)
  );
}

function getRiskLevel(score: number) {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 75) {
    return "Good";
  }

  if (score >= 50) {
    return "Needs Attention";
  }

  if (score >= 25) {
    return "High Risk";
  }

  return "Critical Risk";
}

function shouldAnalyzeFile(path: string) {
  const lower = path.toLowerCase();

  const ignoredExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".webp",
    ".mp4",
    ".mp3",
    ".zip",
    ".pdf",
    ".lock",
  ];

  return !ignoredExtensions.some(
    (extension) =>
      lower.endsWith(extension)
  );
}

function scanFile(
  path: string,
  content: string
): SecurityIssue[] {
  const issues: SecurityIssue[] = [];

  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    /*
     * HARDCODED SECRETS
     */

    if (
      /(api[_-]?key|secret[_-]?key|access[_-]?token|auth[_-]?token|password)\s*[:=]\s*["'][^"']{8,}["']/i.test(
        line
      )
    ) {
      issues.push({
        file: path,
        line: lineNumber,
        type: "Hardcoded Secret",
        severity: "Critical",
        message:
          "Possible hardcoded secret or credential detected.",
        code: line.trim(),
      });
    }

    /*
     * GITHUB TOKEN
     */

    if (
      /gh[pousr]_[A-Za-z0-9_]{20,}/.test(
        line
      )
    ) {
      issues.push({
        file: path,
        line: lineNumber,
        type: "GitHub Token",
        severity: "Critical",
        message:
          "Possible GitHub access token detected.",
        code: line.trim(),
      });
    }

    /*
     * OPENAI STYLE API KEY
     */

    if (
      /sk-[A-Za-z0-9]{20,}/.test(line)
    ) {
      issues.push({
        file: path,
        line: lineNumber,
        type: "API Key",
        severity: "Critical",
        message:
          "Possible API key detected in source code.",
        code: line.trim(),
      });
    }

    /*
     * EVAL
     */

    if (
      /\beval\s*\(/.test(line)
    ) {
      issues.push({
        file: path,
        line: lineNumber,
        type: "Unsafe Eval",
        severity: "High",
        message:
          "Use of eval() can execute arbitrary code.",
        code: line.trim(),
      });
    }

    /*
     * INNERHTML
     */

    if (
      /\.innerHTML\s*=/.test(line)
    ) {
      issues.push({
        file: path,
        line: lineNumber,
        type: "Potential XSS",
        severity: "High",
        message:
          "Direct innerHTML assignment may introduce XSS vulnerabilities.",
        code: line.trim(),
      });
    }

    /*
     * DANGEROUS HTML
     */

    if (
      /dangerouslySetInnerHTML/.test(
        line
      )
    ) {
      issues.push({
        file: path,
        line: lineNumber,
        type: "Potential XSS",
        severity: "High",
        message:
          "dangerouslySetInnerHTML should only be used with trusted or sanitized content.",
        code: line.trim(),
      });
    }

    /*
     * SQL STRING CONCATENATION
     */

    if (
      /(SELECT|INSERT|UPDATE|DELETE).*(\+|\$\{)/i.test(
        line
      )
    ) {
      issues.push({
        file: path,
        line: lineNumber,
        type: "Potential SQL Injection",
        severity: "High",
        message:
          "SQL query appears to use string interpolation or concatenation.",
        code: line.trim(),
      });
    }

    /*
     * COMMAND EXECUTION
     */

    if (
      /child_process|exec\s*\(|execSync\s*\(|spawn\s*\(/.test(
        line
      )
    ) {
      issues.push({
        file: path,
        line: lineNumber,
        type: "Command Execution",
        severity: "High",
        message:
          "Command execution can become dangerous when user input is not validated.",
        code: line.trim(),
      });
    }

    /*
     * DISABLE TLS VERIFICATION
     */

    if (
      /rejectUnauthorized\s*:\s*false/.test(
        line
      )
    ) {
      issues.push({
        file: path,
        line: lineNumber,
        type: "TLS Verification Disabled",
        severity: "Medium",
        message:
          "TLS certificate verification is disabled.",
        code: line.trim(),
      });
    }

    /*
     * HTTP URL
     */

    if (
      /http:\/\/(?!localhost)/i.test(
        line
      )
    ) {
      issues.push({
        file: path,
        line: lineNumber,
        type: "Insecure HTTP",
        severity: "Low",
        message:
          "HTTP connection detected instead of HTTPS.",
        code: line.trim(),
      });
    }
  });

  return issues;
}

async function getGitHubFiles(
  owner: string,
  repo: string,
  branch: string,
  token?: string
) {
  const headers: HeadersInit = {
    Accept:
      "application/vnd.github+json",
    "X-GitHub-Api-Version":
      "2022-11-28",
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    {
      headers,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status}`
    );
  }

  const data = await response.json();

  return data.tree.filter(
    (item: {
      type: string;
      path: string;
    }) =>
      item.type === "blob" &&
      shouldAnalyzeFile(item.path)
  );
}

async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string,
  token?: string
) {
  const headers: HeadersInit = {
    Accept:
      "application/vnd.github+json",
    "X-GitHub-Api-Version":
      "2022-11-28",
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
      path
    )}?ref=${encodeURIComponent(branch)}`,
    {
      headers,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (
    data.type !== "file" ||
    !data.content
  ) {
    return null;
  }

  return Buffer.from(
    data.content,
    "base64"
  ).toString("utf-8");
}

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const owner =
      searchParams.get("owner") ||
      DEFAULT_OWNER;

    const repo =
      searchParams.get("repo") ||
      DEFAULT_REPO;

    const branch =
      searchParams.get("branch") ||
      DEFAULT_BRANCH;

    const token =
      process.env.GITHUB_TOKEN;

    const files =
      await getGitHubFiles(
        owner,
        repo,
        branch,
        token
      );

    const issues: SecurityIssue[] =
      [];

    for (const file of files) {
      const content =
        await getFileContent(
          owner,
          repo,
          file.path,
          branch,
          token
        );

      if (!content) {
        continue;
      }

      const fileIssues =
        scanFile(
          file.path,
          content
        );

      issues.push(...fileIssues);
    }

    const critical =
      issues.filter(
        (issue) =>
          issue.severity ===
          "Critical"
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
      calculateSecurityScore(
        issues
      );

    const result: SecurityResult =
      {
        repository:
          `${owner}/${repo}`,

        branch,

        summary: {
          securityScore,
          riskLevel:
            getRiskLevel(
              securityScore
            ),

          filesScanned:
            files.length,

          issuesFound:
            issues.length,

          critical,
          high,
          medium,
          low,
        },

        issues,
      };

    return NextResponse.json(
      result
    );
  } catch (error) {
    console.error(
      "Security analysis error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Security analysis failed",
      },
      {
        status: 500,
      }
    );
  }
}