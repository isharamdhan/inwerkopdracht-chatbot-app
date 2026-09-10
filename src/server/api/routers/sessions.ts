import { createTRPCRouter, publicProcedure, } from "~/server/api/trpc";
import type { SessionRow } from "~/server/types/session";
import { db } from "~/server/db";

// Get all sessions from db
async function getSessions() {
  const sql = `
    SELECT id, title, created_at
    FROM sessions
    ORDER BY created_at DESC
  `;

  const result = await db.query<SessionRow[]>(sql);
  const sessions = result[0];

  return sessions;
}

// Create router for session-related functions
export const sessionsRouter = createTRPCRouter({
    // get all sessions
  list: publicProcedure.query(getSessions),
});
