
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIAssistantPage() {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Code Assistant. Ask me about your repository, code quality, bugs, security, or technical debt.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const question = input.trim();

    if (!question || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: question,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/assistant",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            question,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Assistant request failed"
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <main className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">

          <div className="logo-icon">
            AI
          </div>

          <span>
            Code Intelligence
          </span>

        </div>

        <nav className="dashboard-nav">

          <button
            className="dashboard-nav-item"
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
          >
            <span>▦</span>
            Overview
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              router.push(
                "/dashboard/analysis"
              )
            }
          >
            <span>⌘</span>
            Code Analysis
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              router.push(
                "/dashboard/security"
              )
            }
          >
            <span>◇</span>
            Security
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              router.push(
                "/dashboard/bugs"
              )
            }
          >
            <span>△</span>
            Bug Prediction
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              router.push(
                "/dashboard/technical-debt"
              )
            }
          >
            <span>◈</span>
            Technical Debt
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              router.push(
                "/dashboard/search"
              )
            }
          >
            <span>⌕</span>
            Semantic Search
          </button>

          <button
            className="dashboard-nav-item active"
          >
            <span>✦</span>
            AI Assistant
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button className="dashboard-nav-item">
            <span>⚙</span>
            Settings
          </button>

          <div className="user-card">

            <div className="user-avatar">
              HS
            </div>

            <div>

              <strong>
                Developer
              </strong>

              <span>
                Free Plan
              </span>

            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <section className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <p className="breadcrumb">
              Workspace / Repository /
              AI Assistant
            </p>

            <h1>
              AI Assistant
            </h1>

          </div>

        </header>

        {/* REPOSITORY */}

        <div className="repository-bar">

          <div className="repository-info">

            <div className="github-icon">
              GH
            </div>

            <div>

              <strong>
                ai-code-intelligence
              </strong>

              <span>
                Husnain224 /
                ai-code-intelligence
              </span>

            </div>

          </div>

          <div className="repository-status">

            <span className="online-dot"></span>

            AI Repository Assistant

            <span className="branch">
              main
            </span>

          </div>

        </div>

        {/* ASSISTANT */}

        <section
          className="dashboard-section"
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            width: "100%",
          }}
        >

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Ask your codebase
                </h2>

                <p>
                  Ask questions about your
                  repository and get AI-powered
                  answers.
                </p>

              </div>

              <div
                style={{
                  fontSize: "28px",
                }}
              >
                ✦
              </div>

            </div>

            {/* MESSAGES */}

            <div
              style={{
                minHeight:
                  "420px",
                maxHeight:
                  "520px",
                overflowY:
                  "auto",
                padding:
                  "25px",
              }}
            >

              {messages.map(
                (message, index) => (

                  <div
                    key={index}
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        message.role ===
                        "user"
                          ? "flex-end"
                          : "flex-start",
                      marginBottom:
                        "18px",
                    }}
                  >

                    <div
                      style={{
                        maxWidth:
                          "75%",
                        padding:
                          "14px 18px",
                        borderRadius:
                          "12px",
                        background:
                          message.role ===
                          "user"
                            ? "#111827"
                            : "#f3f4f6",
                        color:
                          message.role ===
                          "user"
                            ? "white"
                            : "#111827",
                        lineHeight:
                          "1.6",
                        whiteSpace:
                          "pre-wrap",
                      }}
                    >

                      <div
                        style={{
                          fontSize:
                            "12px",
                          fontWeight:
                            600,
                          marginBottom:
                            "5px",
                          opacity:
                            0.7,
                        }}
                      >
                        {message.role ===
                        "user"
                          ? "YOU"
                          : "AI ASSISTANT"}
                      </div>

                      {message.content}

                    </div>

                  </div>

                )
              )}

              {loading && (

                <div
                  style={{
                    padding:
                      "14px 18px",
                    color:
                      "#6b7280",
                  }}
                >
                  AI is thinking...
                </div>

              )}

            </div>

            {/* INPUT */}

            <form
              onSubmit={handleSubmit}
              style={{
                display:
                  "flex",
                gap: "12px",
                padding:
                  "20px 25px",
                borderTop:
                  "1px solid #e5e7eb",
              }}
            >

              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }
                placeholder="Ask about your code..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding:
                    "14px 16px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    "8px",
                  fontSize:
                    "15px",
                  outline:
                    "none",
                }}
              />

              <button
                type="submit"
                className="primary-small"
                disabled={
                  loading ||
                  !input.trim()
                }
              >
                {loading
                  ? "Thinking..."
                  : "Ask AI"}
              </button>

            </form>

          </div>

        </section>

        {/* SUGGESTED QUESTIONS */}

        <section
          className="dashboard-section"
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            width: "100%",
          }}
        >

          <div className="dashboard-grid">

            <QuestionCard
              question="What are the biggest problems in my code?"
              onClick={() =>
                setInput(
                  "What are the biggest problems in my code?"
                )
              }
            />

            <QuestionCard
              question="How can I improve code quality?"
              onClick={() =>
                setInput(
                  "How can I improve code quality?"
                )
              }
            />

            <QuestionCard
              question="Which files should I refactor?"
              onClick={() =>
                setInput(
                  "Which files should I refactor?"
                )
              }
            />

          </div>

        </section>

      </section>

    </main>
  );
}

function QuestionCard({
  question,
  onClick,
}: {
  question: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="dashboard-card"
      style={{
        textAlign: "left",
        cursor: "pointer",
        border: "none",
      }}
    >

      <div className="card-header">

        <div>

          <h2>
            {question}
          </h2>

          <p>
            Ask AI →
          </p>

        </div>

      </div>

    </button>
  );
}
