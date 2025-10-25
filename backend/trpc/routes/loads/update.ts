import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const updateLoadProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      pickup_location: z.string().optional(),
      delivery_location: z.string().optional(),
      pickup_date: z.string().optional(),
      delivery_date: z.string().optional(),
      cargo_weight: z.number().optional(),
      cargo_type: z.string().optional(),
      rate: z.number().optional(),
      distance: z.number().optional(),
      status: z.string().optional(),
      driver_id: z.string().optional(),
      odometer_dispatch: z.number().optional(),
      odometer_pickup: z.number().optional(),
      odometer_delivery: z.number().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    console.log("[TRPC] Updating load:", input);

    try {
      const { id, ...updateData } = input;

      const { data, error } = await ctx.supabase
        .from("loads")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("[TRPC] Error updating load:", error);
        throw new Error(`Failed to update load: ${error.message}`);
      }

      console.log("[TRPC] Updated load:", data);
      return data;
    } catch (error) {
      console.error("[TRPC] Error in updateLoadProcedure:", error);
      throw error;
    }
  });
