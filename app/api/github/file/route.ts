import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const path = searchParams.get("path");

    if (!owner || !repo || !path) {
      return NextResponse.json(
        { error: "Owner, repository and file path are required" },
        { status: 400 }
      );
    }

    const octokit = new Octokit();

    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(response.data) || response.data.type !== "file") {
      return NextResponse.json(
        { error: "The requested path is not a file" },
        { status: 400 }
      );
    }

    const content = Buffer.from(
      response.data.content,
      "base64"
    ).toString("utf-8");

    return NextResponse.json({
      path: response.data.path,
      size: response.data.size,
      sha: response.data.sha,
      content,
    });
  } catch (error) {
    console.error("GitHub File Error:", error);

    return NextResponse.json(
      { error: "Could not retrieve file" },
      { status: 500 }
    );
  }
}