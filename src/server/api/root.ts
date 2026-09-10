import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { healthRouter } from "~/server/api/routers/health";
import { sessionsRouter } from "~/server/api/routers/sessions";
import { messagesRouter } from "~/server/api/routers/messages";
import { systemPromptsRouter } from "~/server/api/routers/system-prompts";

// register all routers 
export const appRouter = createTRPCRouter({
  health: healthRouter,
  sessions: sessionsRouter,
  messages: messagesRouter,
  systemPrompts: systemPromptsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
