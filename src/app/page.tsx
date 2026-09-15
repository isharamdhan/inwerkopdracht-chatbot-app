export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-8">
      <div className="w-full max-w-2xl text-center">

        <h1 className="text-4xl font-bold">
          Welcome to ChatBot Isha!
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-neutral-400">
          Start a new session or select an existing conversation from
          the navigation menu.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-left">
            <h2 className="text-lg font-semibold">
              New conversation instructions
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Click New session in the sidebar to start a new
              conversation.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-left">
            <h2 className="text-lg font-semibold">
              Custom instructions
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Use System instructions to customize the chatbot&apos;s
              behavior.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}