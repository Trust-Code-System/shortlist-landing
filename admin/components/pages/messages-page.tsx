"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/_ui/button";
import Tag from "@/components/_ui/tag";
import { ScrollArea } from "@/components/_ui/scroll-area";
import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import { CURRENT_USER } from "@/data/companies";
import { THREADS, clientById, type Thread } from "@/data/ops";
import { cn } from "@/lib/utils";
import { useCompaniesStore } from "@/stores/companies-store";

export default function MessagesPage() {
  const openDetail = useCompaniesStore((state) => state.openDetail);
  const [threads, setThreads] = useState<Thread[]>(THREADS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState("all");

  const visible = threads.filter((thread) => filter === "all" || thread.unread);
  const active = threads.find((thread) => thread.id === activeId) ?? null;
  const client = active ? clientById(active.clientId) : null;

  function open(id: string) {
    setActiveId(id);
    setThreads((current) => current.map((thread) => (thread.id === id ? { ...thread, unread: false } : thread)));
  }

  function send(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !active) return;
    setThreads((current) =>
      current.map((thread) =>
        thread.id === active.id
          ? { ...thread, messages: [...thread.messages, { from: "team", author: CURRENT_USER.name, text, time: "Just now" }] }
          : thread,
      ),
    );
    setDraft("");
  }

  return (
    <PageShell
      header={
        <PageHeader
          title="Messages"
          tabs={[
            { value: "all", label: "All", count: threads.length },
            { value: "unread", label: "Unread", count: threads.filter((thread) => thread.unread).length },
          ]}
          tab={filter}
          onTabChange={setFilter}
        />
      }
    >
      <div className="flex min-h-0 flex-1">
        <ScrollArea className={cn("border-border min-h-0 w-full shrink-0 border-r md:w-[340px]", active && "hidden md:block")}>
          <ul className="flex flex-col gap-0.5 p-1.5" aria-label="Conversations">
            {visible.map((thread) => {
              const last = thread.messages[thread.messages.length - 1];
              const person = clientById(thread.clientId);
              return (
                <li key={thread.id} className="relative">
                  <Button
                    variant="item"
                    size="none"
                    onClick={() => open(thread.id)}
                    aria-current={thread.id === activeId ? "true" : undefined}
                    className={cn("p-3", thread.id === activeId && "bg-tint/5")}
                  >
                    <span className="bg-muted caption-style text-soft flex size-8 shrink-0 items-center justify-center rounded-lg shadow-[0px_0px_0px_1px_var(--edge)]">
                      {person?.name.slice(0, 1)}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1.5 pr-4">
                      <span className="flex items-center justify-between gap-2">
                        <span className={cn("truncate", thread.unread && "font-medium")}>{person?.name}</span>
                        <span className="caption-style text-subtle shrink-0">{last.time}</span>
                      </span>
                      <span className="caption-style text-subtle">{thread.channel}</span>
                      <span className="p-style text-soft line-clamp-2">{last.text}</span>
                    </span>
                    {thread.unread && <span className="sr-only">Unread</span>}
                  </Button>
                  {thread.unread && <span aria-hidden className="bg-danger pointer-events-none absolute top-4 right-3 size-1.5 rounded-full" />}
                </li>
              );
            })}
            {visible.length === 0 && (
              <li className="caption-style text-subtle p-6 text-center">No unread conversations.</li>
            )}
          </ul>
        </ScrollArea>

        <div className={cn("min-h-0 min-w-0 flex-1 flex-col", active ? "flex" : "hidden md:flex")}>
          {active && client ? (
            <>
              <div className="border-border flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setActiveId(null)}>
                    ← Back
                  </Button>
                  <h2 className="truncate">{client.name}</h2>
                  <Tag tone={active.channel === "WhatsApp" ? "green" : "blue"} size="sm">{active.channel}</Tag>
                </div>
                <Button variant="secondary" size="sm" onClick={() => openDetail(client.id)}>
                  Open client
                </Button>
              </div>
              <ScrollArea className="min-h-0 flex-1">
                <ol className="flex flex-col gap-3 p-4" aria-label={`Conversation with ${client.name}`}>
                  {active.messages.map((message, index) => (
                    <li key={index} className={cn("flex max-w-[78%] flex-col gap-1.5", message.from === "team" ? "self-end items-end" : "self-start")}>
                      <span
                        className={cn(
                          "p-style rounded-xl px-3.5 py-2.5 leading-[1.45]",
                          message.from === "team"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card rounded-bl-sm shadow-[0px_0px_0px_1px_var(--edge)]",
                        )}
                      >
                        {message.text}
                      </span>
                      <span className="caption-style text-subtle">{message.author} · {message.time}</span>
                    </li>
                  ))}
                </ol>
              </ScrollArea>
              <form onSubmit={send} className="border-border flex shrink-0 items-end gap-2 border-t p-3">
                <label htmlFor="reply" className="sr-only">Reply to {client.name}</label>
                <textarea
                  id="reply"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) send(event);
                  }}
                  rows={1}
                  placeholder={`Reply on ${active.channel}…`}
                  className="bg-card border-input focus-visible:border-ring min-h-[38px] flex-1 resize-none rounded-lg border px-3 py-2.5 text-[14px] leading-[1.3] outline-none"
                />
                <Button variant="primary" size="sm" type="submit" disabled={!draft.trim()} className="h-[38px] px-4">
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
              <span className="lead-style font-medium">Choose a conversation</span>
              <span className="caption-style text-subtle">WhatsApp and email threads with clients appear here.</span>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
