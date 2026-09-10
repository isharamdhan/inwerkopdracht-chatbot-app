"use client";

import { api } from "~/trpc/react";

export default function HomePage() {
  const health = api.health.ping.useQuery();
  const sessions = api.sessions.list.useQuery();
  const createSessionMutation = api.sessions.create.useMutation();

  function handleCreateSession() {
  createSessionMutation.mutate({
    title: "Frontend test session",
  });
}

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">ChatBot App Isha!!</h1>
        <p className="mt-2 text-neutral-400">
          Minimal starter:Next.js + tRPC + MySQL + OpenAI.
        </p>
      </div>

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

      {/* Create session test */}
      <div className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-3 font-semibold">Create session test</h2>

        <button
          type="button"
          onClick={handleCreateSession}
          disabled={createSessionMutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Create test session
        </button>

        {createSessionMutation.isPending && <p>Creating session...</p>}

        {createSessionMutation.isSuccess && <p>Session created!</p>}

        {createSessionMutation.isError && (
          <p>Error: {createSessionMutation.error.message}</p>
        )}
      </div>

      {/* Sessions test frontend */}
      <div className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2>Sessions test</h2>

        {sessions.isLoading && <p>Loading sessions...</p>}

        {sessions.isError && <p>Error: {sessions.error.message}</p>}

        {sessions.data && <p>Sessions found: {sessions.data.length}</p>}
      </div>

      <p className="max-w-md text-center text-xs text-neutral-600">
        This only proves the stack is wired up. You build the chat UI, sessions
        and OpenAI integration yourself. See README.md.
      </p>
    </main>
  );
}
