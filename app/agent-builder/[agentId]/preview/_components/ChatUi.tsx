"use client";

import React, { useState } from "react";
import { Bot, RefreshCw, SendHorizonal, Sparkles, User2 } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Agent } from "@/types/AgentTypes";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const initialMessages: Message[] = [
  {
    id: "assistant-welcome",
    role: "assistant",
    content:
      "Agent is ready. Generate the tool config first, then use this panel to test prompts.",
  },
];

type Props = {
  generateAgentToolConfig: () => void;
  hasAgentToolConfig: boolean;
  loading: boolean;
  agentDetail?: Agent;
};

function AssistantMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ className, ...props }) => (
          <h1
            className={cn("mt-1 text-base font-semibold tracking-tight text-zinc-900", className)}
            {...props}
          />
        ),
        h2: ({ className, ...props }) => (
          <h2
            className={cn("mt-1 text-sm font-semibold tracking-tight text-zinc-900", className)}
            {...props}
          />
        ),
        h3: ({ className, ...props }) => (
          <h3 className={cn("text-sm font-semibold text-zinc-800", className)} {...props} />
        ),
        p: ({ className, ...props }) => (
          <p className={cn("whitespace-pre-wrap text-[13px] leading-6 text-zinc-700", className)} {...props} />
        ),
        ul: ({ className, ...props }) => (
          <ul className={cn("ml-5 list-disc space-y-1.5 text-[13px] text-zinc-700", className)} {...props} />
        ),
        ol: ({ className, ...props }) => (
          <ol className={cn("ml-5 list-decimal space-y-1.5 text-[13px] text-zinc-700", className)} {...props} />
        ),
        li: ({ className, ...props }) => <li className={cn("pl-1 leading-6", className)} {...props} />,
        strong: ({ className, ...props }) => (
          <strong className={cn("font-semibold text-zinc-900", className)} {...props} />
        ),
        a: ({ className, ...props }) => (
          <a
            className={cn("font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-4", className)}
            target="_blank"
            rel="noreferrer"
            {...props}
          />
        ),
        blockquote: ({ className, ...props }) => (
          <blockquote
            className={cn(
              "border-l-2 border-indigo-200 bg-indigo-50/60 px-3 py-2 italic text-zinc-700",
              className,
            )}
            {...props}
          />
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;

          if (isInline) {
            return (
              <code
                className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px] text-zinc-800"
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <code
              className={cn("block overflow-x-auto rounded-xl bg-zinc-950/95 p-3 font-mono text-[12px] leading-5 text-zinc-100", className)}
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ className, ...props }) => (
          <pre className={cn("my-2 overflow-hidden", className)} {...props} />
        ),
        hr: (props) => <hr className="my-3 border-zinc-200" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function ChatUi({
  generateAgentToolConfig,
  hasAgentToolConfig,
  loading,
  agentDetail,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const isComposerDisabled = sending || loading || !hasAgentToolConfig;

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const nextValue = value.trim();

    if (!nextValue) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: nextValue,
      },
    ]);
    setValue("");

    if (!agentDetail?.agentToolConfig) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now() + 1}`,
          role: "assistant",
          content:
            "Generate the agent config first. The chat route needs the saved tool configuration before it can run.",
        },
      ]);
      return;
    }

    try {
      setSending(true);

      const result = await axios.post("/api/agent-chat", {
        input: nextValue,
        agents: agentDetail.agentToolConfig?.agents ?? [],
        tools: agentDetail.agentToolConfig?.tools ?? [],
        history: messages
          .filter(
            (message) =>
              message.role === "assistant" || message.role === "user"
          )
          .map((message) => ({
            role: message.role,
            content: message.content,
          })),
        primaryAgentName: agentDetail.agentToolConfig?.primaryAgentName ?? "",
        systemPrompt: agentDetail.agentToolConfig?.systemPrompt ?? "",
        conversationId: conversationId || undefined,
      }, {
        timeout: 20000,
      });

      if (typeof result.data?.conversationId === "string") {
        setConversationId(result.data.conversationId);
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now() + 1}`,
          role: "assistant",
          content:
            typeof result.data?.message === "string" && result.data.message.trim()
              ? result.data.message
              : "The agent did not return a message.",
        },
      ]);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : error.message
        : "Failed to reach the agent chat route.";

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now() + 1}`,
          role: "assistant",
          content: `Agent chat failed: ${errorMessage}`,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Header section - non-scrollable */}
      <div className="shrink-0 space-y-3 overflow-y-auto">
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-700">
              {hasAgentToolConfig
                ? "Regenerate agent runtime config"
                : "Generate agent config to unlock runtime preview"}
            </p>
            <p className="text-xs leading-5 text-zinc-500">
              {hasAgentToolConfig
                ? "Use this action to rebuild the saved runtime config from the current flow."
                : "The chat shell is visible already, but the runtime config still needs to be generated before this can use the saved agent setup."}
            </p>
          </div>

          <Button
            type="button"
            onClick={generateAgentToolConfig}
            className="mt-3"
            disabled={loading || sending}
          >
            <RefreshCw className={loading ? "animate-spin" : ""} />
            {hasAgentToolConfig ? "Rebuild Agent" : "Reboot Agent"}
          </Button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-[11px] font-medium text-indigo-700">
          <Sparkles className="h-3.5 w-3.5" />
          Preview chat shell
        </div>
      </div>

      {/* Messages container - scrollable in middle */}
      <div className="min-h-0 flex-1 overflow-y-auto px-1">
        <div className="space-y-3 py-3">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  isAssistant ? "justify-start" : "justify-end"
                }`}
              >
                {isAssistant && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] break-words rounded-2xl px-3.5 py-2.5 text-xs leading-5 shadow-sm ${
                    isAssistant
                      ? "rounded-bl-md border border-zinc-200 bg-white text-zinc-700"
                      : "rounded-br-md bg-zinc-900 text-white"
                  }`}
                >
                  {isAssistant ? (
                    <div className="space-y-3">
                      <AssistantMessage content={message.content} />
                    </div>
                  ) : (
                    message.content
                  )}
                </div>

                {!isAssistant && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                    <User2 className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <div className="shrink-0 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !isComposerDisabled) {
                event.preventDefault();
                void handleSend();
              }
            }}
            placeholder={
              !hasAgentToolConfig
                ? "Generate the agent config to enable chat..."
                : sending
                  ? "Waiting for agent response..."
                  : "Type a message to test..."
            }
            className="h-10 border-none bg-zinc-50 shadow-none focus-visible:ring-2"
            disabled={isComposerDisabled}
          />
          <Button
            type="button"
            onClick={() => void handleSend()}
            className="h-10 rounded-xl px-3"
            disabled={isComposerDisabled}
          >
            <SendHorizonal className={sending ? "animate-pulse" : "h-4 w-4"} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatUi;
