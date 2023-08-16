import { z } from "zod";

const ZSearch = z
    .object({
        player_id: z.preprocess(
            (val) => parseInt(val as string),
            z.string({ invalid_type_error: "player_id must be valid" })
        ),
        auction_id: z.preprocess(
            (val) => parseInt(val as string),
            z.string({ invalid_type_error: "auction_id must be valid" })
        ),
        plays_limit: z.preprocess(
            (val) => parseInt(val as string),
            z.number({ invalid_type_error: "page must be number" })
        ).optional(),
    })
    .strict();

export const bidbotSchemas = {
    ZSearch,
};
