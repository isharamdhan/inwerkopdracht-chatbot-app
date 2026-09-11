import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import type { SystemPromptRow } from "~/server/types/system-prompt";
import { z } from "zod";

// Get the current system prompt from the database.
async function getSystemPrompt() {
  const sql = `
    SELECT id, content, updated_at
    FROM system_prompts
    ORDER BY updated_at DESC
    LIMIT 1
  `;

  const result = await db.query<SystemPromptRow[]>(sql);
  const prompts = result[0];
  const systemPrompt = prompts[0];

  if (systemPrompt === undefined) {
    return null;
  }

  return systemPrompt;
}

// Validate the updated system prompt.
const updateSystemPromptInput = z.object({
  id: z.number().int().positive(),
  content: z.string().min(1),
});

// Update the system prompt in the database.
async function updateSystemPrompt(id: number, content: string) {
  const sql = `
    UPDATE system_prompts
    SET content = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  await db.query(sql, [content, id]);

  return {
    id: id,
    content: content,
  };
}

// Create router for system prompt functions
export const systemPromptsRouter = createTRPCRouter({
    // get the current system prompt
    get: publicProcedure.query(getSystemPrompt),
    // update the system prompt
    update: publicProcedure
      .input(updateSystemPromptInput)
      .mutation(function updateSystemPromptRequest({ input }) {
      return updateSystemPrompt(input.id, input.content);
    }),
});
