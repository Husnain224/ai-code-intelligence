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

    const response = await octokit.rest.repos.get({
      owner,
      repo,
    });

    return NextResponse.json({
      name: response.data.name,
      fullName: response.data.full_name,
      description: response.data.description,
      language: response.data.language,
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      openIssues: response.data.open_issues_count,
      defaultBranch: response.data.default_branch,
      url: response.data.html_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Repository not found" },
      { status: 404 }
    );
  }
}