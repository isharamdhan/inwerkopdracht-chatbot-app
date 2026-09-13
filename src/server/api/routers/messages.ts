import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { MessageRow } from "~/server/types/message";
import { db } from "~/server/db";
import { z } from "zod";

// Validate the session id.
const getMessagesInput = z.object({
  sessionId: z.string().uuid(),
});

// Validate a message sent by the user.
const sendMessageInput = z.object({
  sessionId: z.string().uuid(),
  content: z.string().trim().min(1),
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

// Test the sendMessage procedure.
function sendMessage(sessionId: string, content: string) {
  return {
    sessionId: sessionId,
    content: content,
  };
}

// Create router for message-related functions
export const messagesRouter = createTRPCRouter({
    // get all messages from one session
    listBySession: publicProcedure
    .input(getMessagesInput)
    .query(function getMessagesRequest({ input }) {
      return getMessages(input.sessionId);
    }),
    // Send a message.
    sendMessage: publicProcedure
    .input(sendMessageInput)
    .mutation(function sendMessageRequest({ input }) {
      return sendMessage(input.sessionId, input.content);
    }),
});
