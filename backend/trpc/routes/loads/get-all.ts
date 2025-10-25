import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const getAllLoadsProcedure = publicProcedure
  .input(
    z
      .object({
        status: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
      .optional()
  )
  .query(async ({ ctx, input }) => {
    console.log("[TRPC] Getting all loads", input);

    try {
      let query = ctx.supabase.from("loads").select("*");

      if (input?.status) {
        query = query.eq("status", input.status);
      }

      if (input?.sortBy) {
        query = query.order(input.sortBy, {
          ascending: input.sortOrder === "asc",
        });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("[TRPC] Error fetching loads:", error);
        throw new Error(`Failed to fetch loads: ${error.message}`);
      }

      console.log(`[TRPC] Fetched ${data?.length || 0} loads`);
      return data || [];
    } catch (error) {
      console.error("[TRPC] Error in getAllLoadsProcedure:", error);
      throw error;
    }
  });
