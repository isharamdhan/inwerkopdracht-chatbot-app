import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const healthRouter = createTRPCRouter({
  ping: publicProcedure.query(async ({ ctx }) => {
    let database: "connected" | "unavailable" = "unavailable";
    try {
      await ctx.db.query("SELECT 1");
      database = "connected";
    } catch {
      database = "unavailable";
    }
    return { status: "ok" as const, database };
  }),
});
