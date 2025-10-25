import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const getLoadByIdProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    console.log("[TRPC] Getting load by ID:", input.id);

    try {
      const { data, error } = await ctx.supabase
        .from("loads")
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) {
        console.error("[TRPC] Error fetching load:", error);
        throw new Error(`Failed to fetch load: ${error.message}`);
      }

      console.log("[TRPC] Fetched load:", data);
      return data;
    } catch (error) {
      console.error("[TRPC] Error in getLoadByIdProcedure:", error);
      throw error;
    }
  });
