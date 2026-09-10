import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { healthRouter } from "~/server/api/routers/health";
import { sessionsRouter } from "~/server/api/routers/sessions";
import { messagesRouter } from "~/server/api/routers/messages";

// register all routers 
export const appRouter = createTRPCRouter({
  health: healthRouter,
  sessions: sessionsRouter,
  messages: messagesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
