import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const createOfferProcedure = publicProcedure
  .input(
    z.object({
      load_id: z.string(),
      driver_id: z.string(),
      offered_rate: z.number(),
      status: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    console.log("[TRPC] Creating offer:", input);

    try {
      const { data, error } = await ctx.supabase
        .from("offers")
        .insert({
          ...input,
          status: input.status || "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("[TRPC] Error creating offer:", error);
        throw new Error(`Failed to create offer: ${error.message}`);
      }

      console.log("[TRPC] Created offer:", data);
      return data;
    } catch (error) {
      console.error("[TRPC] Error in createOfferProcedure:", error);
      throw error;
    }
  });
