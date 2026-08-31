import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const filesChanged = Number(body.filesChanged);
    const additions = Number(body.additions);
    const deletions = Number(body.deletions);
    const totalChanges = Number(body.totalChanges);

    if (
      !Number.isFinite(filesChanged) ||
      !Number.isFinite(additions) ||
      !Number.isFinite(deletions) ||
      !Number.isFinite(totalChanges)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input values",
        },
        { status: 400 }
      );
    }

    const projectRoot = process.cwd();

    const pythonScript = path.join(
      projectRoot,
      "app",
      "ml",
      "predict.py"
    );

    const pythonCommand = "python";

    const args = [
      pythonScript,
      String(filesChanged),
      String(additions),
      String(deletions),
      String(totalChanges),
    ];

    const result = await new Promise<string>((resolve, reject) => {
      execFile(
        pythonCommand,
        args,
        {
          cwd: projectRoot,
          windowsHide: true,
          timeout: 30000,
        },
        (error, stdout, stderr) => {
          if (error) {
            console.error("Python prediction error:", error);
            console.error("Python stderr:", stderr);

            reject(
              new Error(
                stderr ||
                  error.message ||
                  "Python prediction failed"
              )
            );

            return;
          }

          resolve(stdout.trim());
        }
      );
    });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "Python returned an empty response",
        },
        { status: 500 }
      );
    }

    let prediction;

    try {
      prediction = JSON.parse(result);
    } catch {
      console.error("Invalid Python response:", result);

      return NextResponse.json(
        {
          success: false,
          error: "Python returned invalid JSON",
          raw: result,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error("Bug prediction API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}