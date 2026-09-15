"use client";

import { useRef } from "react";

import { api } from "~/trpc/react";

export default function SystemInstructionsPage() {
  const systemPrompt = api.systemPrompts.get.useQuery();
  const updateSystemPromptMutation =
    api.systemPrompts.update.useMutation();

  const systemPromptInput = useRef<HTMLTextAreaElement>(null);

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

  return (
    <main className="min-h-screen w-full p-8">
      <h1 className="mb-8 text-3xl font-bold">
        System instructions
      </h1>

      <div className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        {systemPrompt.isLoading && (
          <p>Loading system prompt...</p>
        )}

        {systemPrompt.isError && (
          <p>Error: {systemPrompt.error.message}</p>
        )}

        {systemPrompt.data === null && (
          <p>No system prompt found.</p>
        )}

        {systemPrompt.data && (
          <div>
            <textarea
              ref={systemPromptInput}
              defaultValue={systemPrompt.data.content}
              required
              className="min-h-60 w-full rounded border border-neutral-700 bg-neutral-950 p-4 text-neutral-100"
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

        {updateSystemPromptMutation.isPending && (
          <p className="mt-3">Updating...</p>
        )}

        {updateSystemPromptMutation.isSuccess && (
          <p className="mt-3 text-green-400">
            System prompt updated!
          </p>
        )}

        {updateSystemPromptMutation.isError && (
          <p className="mt-3 text-red-400">
            Error: {updateSystemPromptMutation.error.message}
          </p>
        )}
      </div>
    </main>
  );
}