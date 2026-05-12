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
    <div className="space-y-2.5">
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
            <ol key={blockIndex} className="list-decimal space-y-1 pl-4">
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
            <ul key={blockIndex} className="list-disc space-y-1 pl-4">
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

export default function WidgetChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Welcome to ZubeVision Tech Academy. Ask me about courses, fees, registration, schedules, or payment options.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const quickPrompts = ["Courses", "Fees", "Registration"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(messageOverride?: string) {
    const outgoingMessage = (messageOverride ?? input).trim();

    if (!outgoingMessage || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: outgoingMessage,
    };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(outgoingMessage, messages);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: response.response,
        },
      ]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Sorry, I could not process that right now. Please try again shortly.",
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

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#F5F7FA] text-[#0A2540]">
      <header className="bg-[#0A2540] px-4 pb-4 pt-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white">
            <Image
              src="/zubevision-tech-academy-logo.jpeg"
              alt="ZubeVision Tech Academy logo"
              width={64}
              height={48}
              className="h-full w-full object-contain p-1.5"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00A8A8]">
              Academy Support
            </p>
            <h1 className="truncate text-sm font-semibold">
              ZubeVision AI Assistant
            </h1>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A8A8]" />
              Online
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#00A8A8]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </header>

      <section className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[86%] px-3.5 py-2.5 text-sm leading-6 shadow-sm ${
                message.role === "user"
                  ? "rounded-2xl rounded-br-md bg-[#0A2540] text-white shadow-[#0A2540]/10"
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
            <div className="rounded-2xl rounded-bl-md border border-[#DDE6EF] bg-white px-3.5 py-2.5 text-sm text-[#6B7280] shadow-sm">
              Thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </section>

      <footer className="border-t border-[#DDE6EF] bg-white p-3">
        <div className="flex items-end gap-2 rounded-2xl border border-[#DDE6EF] bg-[#F8FAFC] p-2 focus-within:border-[#00A8A8] focus-within:ring-2 focus-within:ring-[#00A8A8]/15">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about courses..."
            className="h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-[#0A2540] outline-none placeholder:text-[#6B7280]"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={loading}
            className="h-10 rounded-xl bg-[#00A8A8] px-4 text-sm font-semibold text-white shadow-lg shadow-[#00A8A8]/20 transition hover:bg-[#3A86FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </main>
  );
}
