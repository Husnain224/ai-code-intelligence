import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

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

    // 1. Get repository information
    const repository = await octokit.rest.repos.get({
      owner,
      repo,
    });

    const branch = repository.data.default_branch;

    // 2. Get the branch
    const branchData = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });

    const sha = branchData.data.commit.sha;

    // 3. Get repository tree
    const tree = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: sha,
      recursive: "true",
    });

    // 4. Keep only files
    const files = tree.data.tree
      .filter((item) => item.type === "blob")
      .map((item) => ({
        path: item.path,
        sha: item.sha,
        size: item.size,
      }));

    return NextResponse.json({
      repository: `${owner}/${repo}`,
      branch,
      totalFiles: files.length,
      files,
    });
  } catch (error) {
    console.error("GitHub API Error:", error);

    return NextResponse.json(
      {
        error: "Could not retrieve repository files",
      },
      { status: 500 }
    );
  }
}