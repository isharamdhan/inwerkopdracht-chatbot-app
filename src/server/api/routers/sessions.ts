import { createTRPCRouter, publicProcedure, } from "~/server/api/trpc";

// function to test sessions router (returns empty list)
function getSessions() {
  return [];
}

// Create router for session-related functions
export const sessionsRouter = createTRPCRouter({
    // get all sessions
  list: publicProcedure.query(getSessions),
});
