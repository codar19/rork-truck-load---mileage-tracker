import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const createLoadProcedure = publicProcedure
  .input(
    z.object({
      pickup_location: z.string(),
      delivery_location: z.string(),
      pickup_date: z.string(),
      delivery_date: z.string(),
      cargo_weight: z.number(),
      cargo_type: z.string(),
      rate: z.number(),
      distance: z.number(),
      status: z.string().optional(),
      driver_id: z.string().optional(),
      odometer_dispatch: z.number().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    console.log("[TRPC] Creating load:", input);

    try {
      const { data, error } = await ctx.supabase
        .from("loads")
        .insert({
          ...input,
          status: input.status || "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("[TRPC] Error creating load:", error);
        throw new Error(`Failed to create load: ${error.message}`);
      }

      console.log("[TRPC] Created load:", data);
      return data;
    } catch (error) {
      console.error("[TRPC] Error in createLoadProcedure:", error);
      throw error;
    }
  });
