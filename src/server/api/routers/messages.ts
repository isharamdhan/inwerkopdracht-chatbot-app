import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { MessageRow } from "~/server/types/message";
import { db } from "~/server/db";
import { z } from "zod";

// Validate the session id.
const getMessagesInput = z.object({
  sessionId: z.string().uuid(),
});

// Get all messages from one session.
async function getMessages(sessionId: string) {
  const sql = `
    SELECT id, session_id, role, content, created_at
    FROM messages
    WHERE session_id = ?
    ORDER BY created_at ASC
  `;

  const result = await db.query<MessageRow[]>(sql, [sessionId]);
  const messages = result[0];

  return messages;
}

// Create router for message-related functions
export const messagesRouter = createTRPCRouter({
    // get all messages from one session
    listBySession: publicProcedure
    .input(getMessagesInput)
    .query(function getMessagesRequest({ input }) {
      return getMessages(input.sessionId);
    }),
});
