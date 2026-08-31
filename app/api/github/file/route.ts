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
        {
          error: "owner, repo and path are required",
        },
        { status: 400 }
      );
    }

    const octokit = new Octokit();

    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    if (
      Array.isArray(response.data) ||
      response.data.type !== "file" ||
      !response.data.content
    ) {
      return NextResponse.json(
        {
          error: "Requested path is not a file",
        },
        { status: 400 }
      );
    }

    const code = Buffer.from(
      response.data.content,
      "base64"
    ).toString("utf-8");

    return NextResponse.json({
      repository: `${owner}/${repo}`,
      path,
      size: response.data.size,
      code,
    });
  } catch (error) {
    console.error("GitHub File Error:", error);

    return NextResponse.json(
      {
        error: "Could not retrieve file",
      },
      { status: 500 }
    );
  }
}