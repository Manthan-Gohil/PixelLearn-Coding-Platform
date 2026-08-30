"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Code2,
  Send,
  Loader2,
  Plus,
  Trash2,
  MessageSquare,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

function MarkdownRenderer({ content }: { content: string }) {
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedBlock(idx);
      setTimeout(() => setCopiedBlock(null), 2000);
    });
  };

  // Parse markdown content
  const blocks: { type: string; content: string; lang?: string }[] = [];
  let codeBlockIdx = 0;

  const lines = content.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Code block
    const codeMatch = line.match(/^```(\w+)?/);
    if (codeMatch) {
      const lang = codeMatch[1] || "";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", content: codeLines.join("\n"), lang });
      i++;
      continue;
    }

    // Regular line
    blocks.push({ type: "text", content: line });
    i++;
  }

  return (
    <div className="prose-custom space-y-1">
      {blocks.map((block, bi) => {
        if (block.type === "code") {
          const blockIndex = codeBlockIdx++;
          return (
            <div key={bi} className="relative my-3 group">
              {block.lang && (
                <div className="flex items-center justify-between px-4 py-1.5 bg-[#1a1a1a] rounded-t-lg border border-b-0 border-border-light">
                  <span className="text-xs text-text-muted font-mono">{block.lang}</span>
                  <button
                    onClick={() => copyCode(block.content, blockIndex)}
                    className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
                  >
                    {copiedBlock === blockIndex ? (
                      <><Check className="w-3 h-3" /> Copied</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy</>
                    )}
                  </button>
                </div>
              )}
              <pre
                className={`p-4 bg-[#0d0d0d] text-sm text-text-secondary overflow-x-auto font-mono ${
                  block.lang ? "rounded-b-lg border border-t-0 border-border-light" : "rounded-lg border border-border-light"
                }`}
              >
                <code>{block.content}</code>
              </pre>
            </div>
          );
        }

        const line = block.content;

        // Headings
        if (line.startsWith("# "))
          return <h1 key={bi} className="text-xl font-bold text-text-primary mt-6 mb-2">{line.replace(/^# /, "")}</h1>;
        if (line.startsWith("## "))
          return <h2 key={bi} className="text-lg font-bold text-text-primary mt-5 mb-2">{line.replace(/^## /, "")}</h2>;
        if (line.startsWith("### "))
          return <h3 key={bi} className="text-base font-semibold text-text-primary mt-4 mb-1">{line.replace(/^### /, "")}</h3>;

        // Bullet
        if (line.startsWith("- ") || line.startsWith("* "))
          return (
            <div key={bi} className="flex items-start gap-2 text-sm text-text-secondary ml-2">
              <span className="text-[#E6C212] mt-1 shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(line.replace(/^[-*] /, "")) }} />
            </div>
          );

        // Numbered
        if (line.match(/^\d+\.\s/))
          return <p key={bi} className="text-sm text-text-secondary ml-2" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />;

        // Blockquote
        if (line.startsWith("> "))
          return (
            <blockquote key={bi} className="border-l-3 border-[#E6C212] pl-4 py-1 my-2 text-sm text-text-muted italic">
              {line.replace(/^> /, "")}
            </blockquote>
          );

        // Horizontal rule
        if (line.match(/^[-─]{3,}$/))
          return <hr key={bi} className="border-border my-4" />;

        // Empty line
        if (!line.trim()) return <div key={bi} className="h-2" />;

        // Regular paragraph
        return <p key={bi} className="text-sm text-text-secondary" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />;
      })}
    </div>
  );
}

function inlineFormat(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-surface-alt rounded text-[#E6C212] text-xs font-mono">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export default function DSANotesGenerator() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations
  useEffect(() => {
    fetch("/api/ai/dsa-conversations")
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations || []))
      .catch(() => {});
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/dsa-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          conversationId: activeConvoId,
        }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
        return;
      }

      if (!activeConvoId && data.conversationId) {
        setActiveConvoId(data.conversationId);
        setConversations((prev) => [
          {
            id: data.conversationId,
            title: userMsg.length > 60 ? userMsg.substring(0, 60) + "..." : userMsg,
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Failed to get response. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, activeConvoId]);

  const newConversation = () => {
    setActiveConvoId(null);
    setMessages([]);
  };

  const loadConversation = async (id: string) => {
    setActiveConvoId(id);
    setSidebarOpen(false);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/ai/dsa-conversations?id=${id}`);
      const data = await res.json();
      if (data.conversation?.messages) {
        setMessages(data.conversation.messages);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    await fetch(`/api/ai/dsa-conversations?id=${id}`, { method: "DELETE" });
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvoId === id) {
      setActiveConvoId(null);
      setMessages([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    "Explain Two Sum problem with dry run",
    "Generate notes for Merge Sort",
    "Sliding Window Maximum problem explanation",
    "LRU Cache implementation in C++",
    "DP: Longest Common Subsequence notes",
    "Binary Search on rotated sorted array",
  ];

  return (
    <div className="flex h-[calc(100vh-280px)] min-h-[500px] gap-4">
      {/* Sidebar - Conversation History */}
      <div
        className={`${
          sidebarOpen ? "fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent" : "hidden"
        } lg:block`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`w-72 h-full fb-card rounded-xl p-4 flex flex-col overflow-hidden ${
            sidebarOpen ? "absolute left-0 top-0 z-50" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={newConversation}
            className="fb-btn-primary w-full mb-4 justify-center"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
          <div className="flex-1 overflow-y-auto space-y-1 overscroll-contain">
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors ${
                  activeConvoId === c.id
                    ? "bg-[#E6C212]/10 border border-[#E6C212]/30"
                    : "hover:bg-surface-hover"
                }`}
              >
                <button
                  onClick={() => loadConversation(c.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-xs font-medium text-text-primary truncate">
                    {c.title}
                  </p>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(c.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 fb-card rounded-xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-text-muted" />
          </button>
          <Code2 className="w-5 h-5 text-[#E6C212]" />
          <h2 className="text-base font-semibold text-text-primary">DSA Notes Generator</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Code2 className="w-16 h-16 text-text-muted opacity-20 mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                DSA Notes Generator
              </h3>
              <p className="text-sm text-text-muted max-w-md mb-6">
                Paste a LeetCode problem, code snippet, or ask about any DSA topic.
                Get detailed interview-revision notes with dry runs and complexity analysis.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-left p-3 rounded-lg bg-surface-alt border border-border text-xs text-text-secondary hover:text-text-primary hover:border-border-light transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 inline mr-1 text-[#E6C212]" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-4 ${
                    msg.role === "user"
                      ? "bg-[#E6C212]/10 border border-[#E6C212]/30 text-text-primary"
                      : "bg-surface-alt border border-border text-text-secondary"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <MarkdownRenderer content={msg.content} />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm font-sans">{msg.content}</pre>
                  )}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-surface-alt border border-border rounded-xl p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#E6C212]" />
                <span className="text-sm text-text-muted">Generating notes...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste a problem, code, or ask about a DSA topic..."
              rows={2}
              className="flex-1 p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60 resize-none"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="self-end px-4 py-3 rounded-lg bg-[#E6C212] text-black font-semibold hover:bg-[#c9a810] disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
