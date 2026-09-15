"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

export function Sidebar() {
  const router = useRouter();
  const sessions = api.sessions.list.useQuery();

  const createSessionMutation = api.sessions.create.useMutation({
    onSuccess: async function (newSession) {
      await sessions.refetch();

      router.push(`/session/${newSession.id}`);
    },
  });

  function handleCreateSession() {
    createSessionMutation.mutate({
      title: "New chat session.",
    });
  }

  return (
    <aside className="min-h-screen w-64 shrink-0 border-r border-neutral-800 bg-neutral-900 p-6">
      <h1 className="mb-8 text-xl font-bold">
        ChatBot Isha
      </h1>

      <nav className="flex flex-col gap-6">
        <button
          type="button"
          onClick={handleCreateSession}
          disabled={createSessionMutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-left text-white"
        >
          {createSessionMutation.isPending
            ? "Creating..."
            : "+ New session"}
        </button>

        <div>
          <h2 className="mb-3 font-semibold">
            Sessions
          </h2>

          {sessions.isLoading && (
            <p className="text-sm text-neutral-500">
              Loading sessions...
            </p>
          )}

          {sessions.isError && (
            <p className="text-sm text-red-400">
              Error: {sessions.error.message}
            </p>
          )}

          {sessions.data && (
            <div className="flex flex-col gap-2">
              {sessions.data.map(function (session) {
                return (
                  <Link
                    key={session.id}
                    href={`/session/${session.id}`}
                    className="rounded p-3 text-sm hover:bg-neutral-800"
                  >
                    {session.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Link
          href="/system-instructions"
          className="rounded px-4 py-2 hover:bg-neutral-800"
        >
          System instructions
        </Link>
      </nav>
    </aside>
  );
}