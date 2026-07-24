import { env } from "../config/env";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  queryId?: string;
  ratingStatus?: "up" | "down";
  isComplete?: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm an AI assistant trained on Yash Tripathi's background. Ask me anything regarding his experience, skills, or projects!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  const handleRate = async (messageId: string, queryId: string, rating: number) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, ratingStatus: rating > 0 ? "up" : "down" } : m,
      ),
    );

    try {
      const backendUrl = env.BACKEND_URL;
      await fetch(`${backendUrl}/chat/${queryId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });
    } catch (e) {
      console.error("Failed to rate query:", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build history from existing messages
      const history = messages.map((m) => ({
        role: m.sender === "bot" ? "assistant" : "user",
        content: m.text,
      }));

      const backendUrl = env.BACKEND_URL;
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text, history }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      const botMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: botMessageId, text: "", sender: "bot", isComplete: false },
      ]);
      setIsLoading(false); // Turn off loading spinner since we are streaming

      if (reader) {
        let fullText = "";
        let displayedLength = 0;

        // Start a smooth typewriter effect queue
        const typingInterval = setInterval(() => {
          if (displayedLength < fullText.length) {
            displayedLength++; // Reveal 1 character at a time
            const currentText = fullText.slice(0, displayedLength);

            setMessages((prev) =>
              prev.map((m) => (m.id === botMessageId ? { ...m, text: currentText } : m)),
            );
          }
        }, 15); // 15ms per character creates a fast but readable typing effect

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Wait until the typewriter effect has caught up to the end of the text
            const checkDone = setInterval(() => {
              if (displayedLength >= fullText.length) {
                clearInterval(typingInterval);
                clearInterval(checkDone);
                setMessages((prev) =>
                  prev.map((m) => (m.id === botMessageId ? { ...m, isComplete: true } : m)),
                );
              }
            }, 50);
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6);
              if (dataStr === "[DONE]") break;

              try {
                const data = JSON.parse(dataStr);
                if (data.error) {
                  fullText += `\n\nError: ${data.error}`;
                } else if (data.queryId) {
                  setMessages((prev) =>
                    prev.map((m) => (m.id === botMessageId ? { ...m, queryId: data.queryId } : m)),
                  );
                } else if (data.text) {
                  fullText += data.text;
                }
              } catch (e) {
                // Ignore parse errors from partial chunks if any
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting to the server.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-terminal" />
              <h3 className="font-semibold text-foreground">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === "user"
                      ? "bg-terminal text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.sender === "user" ? (
                    msg.text
                  ) : (
                    <div className="space-y-2 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&_strong]:font-semibold [&_strong]:text-terminal">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                      {msg.queryId && msg.isComplete && (
                        <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                          <button
                            onClick={() => handleRate(msg.id, msg.queryId!, 1)}
                            className={`p-1 rounded hover:bg-muted transition-colors ${msg.ratingStatus === "up" ? "text-terminal" : "text-muted-foreground"}`}
                            disabled={!!msg.ratingStatus}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRate(msg.id, msg.queryId!, -1)}
                            className={`p-1 rounded hover:bg-muted transition-colors ${msg.ratingStatus === "down" ? "text-red-400" : "text-muted-foreground"}`}
                            disabled={!!msg.ratingStatus}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-terminal" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-terminal focus:outline-none focus:ring-1 focus:ring-terminal"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-terminal text-primary-foreground hover:bg-terminal-glow disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-terminal text-primary-foreground shadow-lg shadow-terminal/20 hover:bg-terminal-glow hover:scale-105 active:scale-95 transition-all"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
