import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { getAllLoadsProcedure } from "./routes/loads/get-all";
import { getLoadByIdProcedure } from "./routes/loads/get-by-id";
import { createLoadProcedure } from "./routes/loads/create";
import { updateLoadProcedure } from "./routes/loads/update";
import { getAllOffersProcedure } from "./routes/offers/get-all";
import { createOfferProcedure } from "./routes/offers/create";
import { updateOfferProcedure } from "./routes/offers/update";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  loads: createTRPCRouter({
    getAll: getAllLoadsProcedure,
    getById: getLoadByIdProcedure,
    create: createLoadProcedure,
    update: updateLoadProcedure,
  }),
  offers: createTRPCRouter({
    getAll: getAllOffersProcedure,
    create: createOfferProcedure,
    update: updateOfferProcedure,
  }),
});

export type AppRouter = typeof appRouter;