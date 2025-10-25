import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const getAllOffersProcedure = publicProcedure
  .input(
    z
      .object({
        driver_id: z.string().optional(),
        load_id: z.string().optional(),
        status: z.string().optional(),
      })
      .optional()
  )
  .query(async ({ ctx, input }) => {
    console.log("[TRPC] Getting all offers", input);

    try {
      let query = ctx.supabase.from("offers").select(`
        *,
        load:loads(*)
      `);

      if (input?.driver_id) {
        query = query.eq("driver_id", input.driver_id);
      }

      if (input?.load_id) {
        query = query.eq("load_id", input.load_id);
      }

      if (input?.status) {
        query = query.eq("status", input.status);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("[TRPC] Error fetching offers:", error);
        throw new Error(`Failed to fetch offers: ${error.message}`);
      }

      console.log(`[TRPC] Fetched ${data?.length || 0} offers`);
      return data || [];
    } catch (error) {
      console.error("[TRPC] Error in getAllOffersProcedure:", error);
      throw error;
    }
  });
