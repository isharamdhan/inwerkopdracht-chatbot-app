"use client";

import { api } from "~/trpc/react";
import { useRef, useState, type MouseEvent } from "react";

export default function HomePage() {
  const health = api.health.ping.useQuery();
  const sessions = api.sessions.list.useQuery();
  const createSessionMutation = api.sessions.create.useMutation({
    onSuccess: function () {
    sessions.refetch();
  },
  });
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const messages = api.messages.listBySession.useQuery(
    { sessionId: selectedSessionId,},
    { enabled: selectedSessionId !== "",}, );  
  const systemPrompt = api.systemPrompts.get.useQuery();
  const updateSystemPromptMutation = api.systemPrompts.update.useMutation();
  const systemPromptInput = useRef<HTMLTextAreaElement>(null);
  const messageInput = useRef<HTMLInputElement>(null);

  const sendMessageMutation = api.messages.sendMessage.useMutation({
  onSuccess: async function () {
    await messages.refetch();
  },
  });

  function handleCreateSession() {
    createSessionMutation.mutate({
      title: "New chat session.",
    });
  }

  function handleSelectSession(event: MouseEvent<HTMLButtonElement>) {
  const sessionId = event.currentTarget.value;

  setSelectedSessionId(sessionId);
}

  function handleUpdateSystemPrompt() {
    if (!systemPrompt.data) {
      return;
    }
    if (!systemPromptInput.current) {
      return;
    }

    const content = systemPromptInput.current.value;

    updateSystemPromptMutation.mutate({
      id: systemPrompt.data.id,
      content: content,
    });
}

  function handleSendMessage() {
    if (!messageInput.current) {
      return;
    }

    if (selectedSessionId === "") {
      return;
    }

    const content = messageInput.current.value;

    if (content.trim() === "") {
      return;
    }

    sendMessageMutation.mutate({
      sessionId: selectedSessionId,
      content: content,
    });
}

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">ChatBot App Isha!</h1>
        <p className="mt-2 text-neutral-400">
          Minimal starter:Next.js + tRPC + MySQL + OpenAI.
        </p>
      </div>

      <div className="grid w-full gap-8 lg:grid-cols-[240px_minmax(0,1fr)_280px]">

      {/* Sessions sidebar */}
      <aside className="h-fit rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-4 font-semibold">Chats</h2>
        {/* Create new chat session */}
        <button
          type="button"
          onClick={handleCreateSession}
          disabled={createSessionMutation.isPending}
          className="mb-4 w-full rounded bg-blue-600 px-4 py-2 text-white"
        >
          {createSessionMutation.isPending ? "Creating..." : "New chat"}
        </button>

        {sessions.isLoading && <p>Loading chats...</p>}

        {sessions.isError && <p>Error: {sessions.error.message}</p>}

        {sessions.data && (
          <div className="flex flex-col gap-2">
            {sessions.data.map(function (session) {
              return (
                <button
                  key={session.id}
                  type="button"
                  className="rounded p-3 text-left hover:bg-neutral-800"
                  value={session.id}
                  onClick={handleSelectSession}
                >
                  {session.title}
                </button>
              );
            })}
          </div>
        )}
      </aside>

      <section className="flex flex-col gap-8">

      <div className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-neutral-500 uppercase">
          Status
        </h2>

        {health.isLoading && (
          <p className="flex items-center gap-2 text-neutral-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
            Connecting…
          </p>
        )}

        {health.isError && (
          <p className="flex items-center gap-2 text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Error: {health.error.message}
          </p>
        )}

        {health.data && (
          <div className="space-y-1 text-sm">
            <p className="flex items-center gap-2 text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Server reachable via tRPC
            </p>
            <p className="text-neutral-400">
              Database:{" "}
              <span
                className={
                  health.data.database === "connected"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {health.data.database}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Messages test frontend */}
      {/* Chat messages */}
      <div className="flex min-h-96 w-full flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-6 text-xl font-semibold">Hallo Isha!</h2>

        {selectedSessionId === "" && (
          <p className="text-neutral-400">
            Select a chat to view the messages.
          </p>
        )}

        {messages.isLoading && <p>Loading messages...</p>}

        {messages.isError && <p>Error: {messages.error.message}</p>}

        {messages.data && messages.data.length === 0 && (
          <p className="text-neutral-400">
            This chat does not have any messages yet.
          </p>
        )}

        {messages.data && (
          <div className="flex flex-col gap-3">
            {messages.data.map(function (message) {
              return (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-3/4 rounded-xl bg-blue-600 p-3"
                      : "mr-auto max-w-3/4 rounded-xl bg-neutral-800 p-3"
                  }
                >
                  <p className="mb-1 text-xs font-semibold">
                    {message.role === "user" ? "You" : "ChatBot Isha"}
                  </p>

                  <p>{message.content}</p>
                </div>
              );
            })}
          </div>
        )}

      {/* Message input */}
      {selectedSessionId !== "" && (
        <div className="mt-auto pt-6">
          <div className="flex gap-2">
            <input
              ref={messageInput}
              type="text"
              placeholder="Type your message..."
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-4 py-3 text-white"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending}
              className="rounded bg-blue-600 px-5 py-3 text-white"
            >
              {sendMessageMutation.isPending ? "Sending..." : "Send"}
            </button>
          </div>

          {sendMessageMutation.isSuccess && (
            <p className="mt-2 text-sm text-green-400">
              Test received: {sendMessageMutation.data.content}
            </p>
          )}

          {sendMessageMutation.isError && (
            <p className="mt-2 text-sm text-red-400">
              Error: {sendMessageMutation.error.message}
            </p>
          )}
        </div>
      )}

      </div>

      </section>

      <aside>

      {/* System prompt test frontend */}
      <div className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-3 font-semibold">System prompt test</h2>

        {systemPrompt.isLoading && <p>Loading system prompt...</p>}

        {systemPrompt.isError && <p>Error: {systemPrompt.error.message}</p>}

        {systemPrompt.data === null && <p>No system prompt found.</p>}

        {systemPrompt.data && <p>{systemPrompt.data.content}</p>}
        {systemPrompt.data && (
          <div onSubmit={handleUpdateSystemPrompt}>
            <textarea
              ref={systemPromptInput}
              defaultValue={systemPrompt.data.content}
              required
              className="min-h-40 w-full rounded border border-neutral-700 bg-neutral-950 p-3 text-sm text-neutral-100"
            />

            <button
              type="button"
              onClick={handleUpdateSystemPrompt}
              disabled={updateSystemPromptMutation.isPending}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
            >
              Save system prompt
            </button>
          </div>
        )}

        {updateSystemPromptMutation.isPending && <p>Updating...</p>}

        {updateSystemPromptMutation.isSuccess && (
          <p>System prompt updated!</p>
        )}

        {updateSystemPromptMutation.isError && (
          <p>Error: {updateSystemPromptMutation.error.message}</p>
        )}
      </div>

      </aside>
      </div>

      <p className="max-w-md text-center text-xs text-neutral-600">
        This only proves the stack is wired up. You build the chat UI, sessions
        and OpenAI integration yourself. See README.md.
      </p>
    </main>
  );
}
