import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { MessageRow } from "~/server/types/message";
import { db } from "~/server/db";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { openai } from "~/server/openai";
import type { SystemPromptRow } from "~/server/types/system-prompt";

// Validate the session id.
const getMessagesInput = z.object({
  sessionId: z.string().uuid(),
});

// Get the active system prompt from the database.
async function getSystemPromptContent() {
  const sql = `
    SELECT id, content, updated_at
    FROM system_prompts
    ORDER BY updated_at DESC
    LIMIT 1
  `;

  const result = await db.query<SystemPromptRow[]>(sql);
  const prompts = result[0];
  const prompt = prompts[0];

  if (!prompt) {
    throw new Error("No system prompt found.");
  }

  return prompt.content;
}

// Save a user message in the database.
async function saveUserMessage(sessionId: string, content: string) {
  const messageId = randomUUID();

  const sql = `
    INSERT INTO messages (id, session_id, role, content)
    VALUES (?, ?, ?, ?)
  `;

  await db.query(sql, [
    messageId,
    sessionId,
    "user",
    content,
  ]);

  return messageId;
}

// Save an assistant message in the database.
async function saveAssistantMessage(
  sessionId: string,
  content: string,
) {
  const messageId = randomUUID();

  const sql = `
    INSERT INTO messages (id, session_id, role, content)
    VALUES (?, ?, ?, ?)
  `;

  await db.query(sql, [
    messageId,
    sessionId,
    "assistant",
    content,
  ]);

  return messageId;
}

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

async function sendMessage(sessionId: string, content: string) {
  const systemPrompt = await getSystemPromptContent();

  const response = await openai.responses.create({
    model: "gpt-5.4-nano",
    instructions: systemPrompt,
    input: content,
  });

  const answer = response.output_text.trim();

  if (answer === "") {
    throw new Error("OpenAI returned an empty answer.");
  }

  const userMessageId = await saveUserMessage(
    sessionId,
    content,
  );

  const assistantMessageId = await saveAssistantMessage(
    sessionId,
    answer,
  );

  return {
    id: userMessageId,
    sessionId: sessionId,
    content: content,
    answerId: assistantMessageId,
    answer: answer,
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
