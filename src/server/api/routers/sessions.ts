import { createTRPCRouter, publicProcedure, } from "~/server/api/trpc";
import type { SessionRow } from "~/server/types/session";
import { db } from "~/server/db";
import { randomUUID } from "node:crypto";
import { z } from "zod";

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

// Validate the title of a new session.
const createSessionInput = z.object({
  title: z.string().min(1).max(255),
});


// Create a new session in the database.
async function createSession(title: string) {
  const id = randomUUID();

  const sql = `
    INSERT INTO sessions (id, title, created_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `;

  await db.query(sql, [id, title]);

  return {
    id: id,
    title: title,
  };
}

// Create router for session-related functions
export const sessionsRouter = createTRPCRouter({
    // get all sessions
  list: publicProcedure.query(getSessions),
    // create a new session
  create: publicProcedure
    .input(createSessionInput)
    .mutation(function createSessionRequest({ input }) {
      return createSession(input.title);
    }),
});
