import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { healthRouter } from "~/server/api/routers/health";
import { sessionsRouter } from "~/server/api/routers/sessions";

// register all routers 
export const appRouter = createTRPCRouter({
  health: healthRouter,
  sessions: sessionsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
