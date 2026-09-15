"use client";

import { useParams } from "next/navigation";
import { useRef, type KeyboardEvent } from "react";

import { api } from "~/trpc/react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SessionPage() {
  // Get the session ID from the current URL.
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  // Used to refresh the session title in the sidebar.
  const sessions = api.sessions.list.useQuery();

  // Get all messages from the current session.
  const messages = api.messages.listBySession.useQuery({
    sessionId: sessionId,
  });

  // Gives access to the message input.
  const messageInput = useRef<HTMLInputElement>(null);

  const sendMessageMutation = api.messages.sendMessage.useMutation({
    onSuccess: async function () {
      // Refresh the messages and the session title.
      await messages.refetch();
      await sessions.refetch();

      if (messageInput.current) {
        messageInput.current.value = "";
      }
    },
  });

  // Send the message entered by the user.
  function handleSendMessage() {
    if (!messageInput.current) {
      return;
    }

    const content = messageInput.current.value;

    if (content.trim() === "") {
      return;
    }

    sendMessageMutation.mutate({
      sessionId: sessionId,
      content: content,
    });
  }

  // Send the message when the user presses Enter.
  function handleMessageKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          ChatBot App Isha!
        </h1>

        <p className="mt-2 text-neutral-400">
          Your customizable chatbot assistant 😊
        </p>
      </div>

      <section className="flex flex-1 flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Hallo Isha!
        </h2>

        {messages.isLoading && (
          <p>Loading messages...</p>
        )}

        {messages.isError && (
          <p className="text-red-400">
            Error: {messages.error.message}
          </p>
        )}

        {messages.data?.length === 0 && (
          <p className="text-neutral-400">
            This chat does not have any messages yet.
          </p>
        )}

        {/* Show all messages from this session. */}
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
                    {message.role === "user"
                      ? "You"
                      : "ChatBot Isha"}
                  </p>

                  {/* Render assistant responses as Markdown. */}
                  {message.role === "assistant" ? (
                    <div className="markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {sendMessageMutation.isPending && (
          <div className="mr-auto mt-3 max-w-3/4 rounded-xl bg-neutral-800 p-3">
            <p className="animate-pulse text-neutral-400">
              ChatBot Isha is typing...
            </p>
          </div>
        )}

        <div className="mt-auto pt-6">
          <div className="flex gap-2">
            <input
              ref={messageInput}
              type="text"
              placeholder="Type your message..."
              onKeyDown={handleMessageKeyDown}
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-4 py-3 text-white"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending}
              className="rounded bg-blue-600 px-5 py-3 text-white"
            >
              {sendMessageMutation.isPending
                ? "Sending..."
                : "Send"}
            </button>
          </div>

          {sendMessageMutation.isError && (
            <p className="mt-2 text-sm text-red-400">
              Error: {sendMessageMutation.error.message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}