import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const updateOfferProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      status: z.string().optional(),
      offered_rate: z.number().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    console.log("[TRPC] Updating offer:", input);

    try {
      const { id, ...updateData } = input;

      const { data, error } = await ctx.supabase
        .from("offers")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("[TRPC] Error updating offer:", error);
        throw new Error(`Failed to update offer: ${error.message}`);
      }

      console.log("[TRPC] Updated offer:", data);
      return data;
    } catch (error) {
      console.error("[TRPC] Error in updateOfferProcedure:", error);
      throw error;
    }
  });
