import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";

function runPythonPrediction(
  filesChanged: number,
  additions: number,
  deletions: number,
  totalChanges: number
): Promise<any> {
  return new Promise((resolve, reject) => {
    const projectRoot = process.cwd();

    const pythonScript = path.join(
      projectRoot,
      "app",
      "ml",
      "predict.py"
    );

    // Windows: use "python"
    // Linux/Mac: you can change this to "python3"
    const pythonCommand =
      process.platform === "win32"
        ? "python"
        : "python3";

    execFile(
      pythonCommand,
      [
        pythonScript,
        String(filesChanged),
        String(additions),
        String(deletions),
        String(totalChanges),
      ],
      {
        cwd: projectRoot,
        timeout: 30000,
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(
            "Python execution error:",
            error
          );

          console.error(
            "Python stderr:",
            stderr
          );

          reject(
            new Error(
              stderr ||
                error.message ||
                "Python prediction failed"
            )
          );

          return;
        }

        try {
          const result = JSON.parse(
            stdout.trim()
          );

          resolve(result);

        } catch (parseError) {
          console.error(
            "Python output:",
            stdout
          );

          reject(
            new Error(
              "Could not parse Python prediction."
            )
          );
        }
      }
    );
  });
}


// ======================================================
// GET
// ======================================================

export async function GET(
  request: NextRequest
) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const filesChanged = Number(
      searchParams.get(
        "filesChanged"
      )
    );

    const additions = Number(
      searchParams.get(
        "additions"
      )
    );

    const deletions = Number(
      searchParams.get(
        "deletions"
      )
    );

    const totalChanges = Number(
      searchParams.get(
        "totalChanges"
      )
    );

    // ----------------------------------------------
    // Validate input
    // ----------------------------------------------

    if (
      !Number.isFinite(filesChanged) ||
      !Number.isFinite(additions) ||
      !Number.isFinite(deletions) ||
      !Number.isFinite(totalChanges)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid prediction parameters."
        },
        {
          status: 400
        }
      );
    }

    // ----------------------------------------------
    // Run ML model
    // ----------------------------------------------

    const result =
      await runPythonPrediction(
        filesChanged,
        additions,
        deletions,
        totalChanges
      );

    // ----------------------------------------------
    // Return result
    // ----------------------------------------------

    return NextResponse.json(
      result
    );

  } catch (error) {

    console.error(
      "Bug prediction API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Bug prediction failed."
      },
      {
        status: 500
      }
    );
  }
}


// ======================================================
// POST
// ======================================================

export async function POST(
  request: NextRequest
) {
  try {

    const body =
      await request.json();

    const filesChanged = Number(
      body.filesChanged
    );

    const additions = Number(
      body.additions
    );

    const deletions = Number(
      body.deletions
    );

    const totalChanges = Number(
      body.totalChanges
    );

    // ----------------------------------------------
    // Validate
    // ----------------------------------------------

    if (
      !Number.isFinite(filesChanged) ||
      !Number.isFinite(additions) ||
      !Number.isFinite(deletions) ||
      !Number.isFinite(totalChanges)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "filesChanged, additions, deletions and totalChanges must be numbers."
        },
        {
          status: 400
        }
      );
    }

    // ----------------------------------------------
    // Run model
    // ----------------------------------------------

    const result =
      await runPythonPrediction(
        filesChanged,
        additions,
        deletions,
        totalChanges
      );

    return NextResponse.json(
      result
    );

  } catch (error) {

    console.error(
      "Bug prediction POST error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Bug prediction failed."
      },
      {
        status: 500
      }
    );
  }
}