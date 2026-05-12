"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { sendChatMessage, ChatMessage } from "@/lib/api";

function renderInlineMarkdown(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function normalizeMarkdown(content: string) {
  return content
    .replace(/\s+(#{1,6}\s+)/g, "\n\n$1")
    .replace(/\s+(-\s+)/g, "\n$1")
    .replace(/\s+(\d+\.\s+)/g, "\n$1")
    .trim();
}

function FormattedMessage({ content }: { content: string }) {
  const blocks = normalizeMarkdown(content).split(/\n{2,}/);

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length === 0) {
          return null;
        }

        const heading = lines[0].match(/^#{1,6}\s+(.+)$/);

        if (heading) {
          return (
            <h3 key={blockIndex} className="font-semibold text-[#0A2540]">
              {renderInlineMarkdown(heading[1])}
            </h3>
          );
        }

        const isNumberedList = lines.every((line) => /^\d+\.\s+/.test(line));
        const isBulletList = lines.every((line) => /^-\s+/.test(line));

        if (isNumberedList) {
          return (
            <ol key={blockIndex} className="list-decimal space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  {renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        if (isBulletList) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  {renderInlineMarkdown(line.replace(/^-\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        return <p key={blockIndex}>{renderInlineMarkdown(lines.join(" "))}</p>;
      })}
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello. I am the ZubeVision Tech Academy AI Assistant. I can help you with courses, fees, schedules, registration, and payment information. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const quickPrompts = [
    "Show me all courses",
    "How much is Full-Stack AI Engineering?",
    "How do I register?",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(input, messages);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Sorry, I could not process that request right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleQuickPrompt(prompt: string) {
    setInput(prompt);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#F5F7FA_0%,#FFFFFF_46%,#EAF7FA_100%)] px-4 py-5 text-[#0A2540] sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-40px)] w-full max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="flex flex-col justify-between rounded-2xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-[#0A2540]/10 backdrop-blur">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#DDE6EF] bg-white shadow-sm">
                <Image
                  src="/zubevision-tech-academy-logo.jpeg"
                  alt="ZubeVision Tech Academy logo"
                  width={96}
                  height={72}
                  className="h-full w-full object-contain p-2"
                  priority
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#00A8A8]">
                  AI Admissions Desk
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight">
                  ZubeVision Tech Academy
                </h1>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-[#6B7280]">
              Get clear answers about AI courses, tuition, class schedules,
              registration steps, and payment details.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {["Learn", "Build", "Deploy"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[#DDE6EF] bg-[#F5F7FA] px-3 py-3 text-center"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0A2540]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[#0A2540] p-5 text-white">
            <div className="mb-4 h-1 w-16 rounded-full bg-[#00A8A8]" />
            <p className="text-sm font-semibold">Ready to help</p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Ask naturally. The assistant will keep answers focused,
              structured, and easy to act on.
            </p>
          </div>
        </aside>

        <div className="flex min-h-[82vh] flex-col overflow-hidden rounded-2xl border border-[#DDE6EF] bg-white shadow-2xl shadow-[#0A2540]/12">
          <div className="border-b border-[#E5EAF0] bg-white px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00A8A8]">
                  Live Assistant
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  Ask ZubeVision Academy
                </h2>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#CFE9E9] bg-[#F2FBFB] px-3 py-2 text-xs font-semibold text-[#0A2540]">
                <span className="h-2 w-2 rounded-full bg-[#00A8A8]" />
                Online
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-[#E5EAF0] bg-[#F8FAFC] px-5 py-3 sm:px-6">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleQuickPrompt(prompt)}
                className="shrink-0 rounded-full border border-[#DDE6EF] bg-white px-4 py-2 text-xs font-semibold text-[#0A2540] transition hover:border-[#00A8A8] hover:text-[#008F8F]"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto bg-[#FBFCFE] p-5 sm:p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[86%] px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[78%] ${
                    message.role === "user"
                      ? "rounded-2xl rounded-br-md bg-[#0A2540] text-white shadow-[#0A2540]/15"
                      : "rounded-2xl rounded-bl-md border border-[#DDE6EF] bg-white text-[#0A2540]"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <FormattedMessage content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-[#DDE6EF] bg-white px-4 py-3 text-sm text-[#6B7280] shadow-sm">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-[#E5EAF0] bg-white p-4 sm:p-5">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="h-12 flex-1 resize-none rounded-lg border border-[#D1D9E2] p-3 text-sm text-[#0A2540] outline-none transition placeholder:text-[#6B7280] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20"
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="h-12 rounded-lg bg-[#00A8A8] px-6 text-sm font-semibold text-white shadow-lg shadow-[#00A8A8]/20 transition hover:bg-[#3A86FF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
