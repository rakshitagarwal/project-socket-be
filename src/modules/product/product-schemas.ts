import { z } from "zod";

const schema = (() => {
    const title = z.string().min(1);
    const description = z.string();
    const product_category_id = z.string().uuid();
    const landing_image = z.string().uuid();
    const price = z.number();

    const ZNewAdd = z
        .object({
            title: title,
            description: description.optional(),
            product_category_id: product_category_id,
            landing_image: landing_image,
            price: price.gt(0),
            media_id: z.array(z.string().uuid()),
        })
        .strict();

    const ZUpdate = z
        .object({
            title: title.optional(),
            description: description.optional(),
            price: price.optional(),
            product_category_id: product_category_id,
            landing_image: landing_image,
            media_id: z.array(z.string().uuid()),
            status: z.boolean().optional(),
        })
        .strict();

    const ZGetId = z
        .object({
            id: z.string().uuid().optional(),
        })
        .strict();

    const ZDelete = z
        .object({
            ids: z.array(z.string().uuid()),
        })
        .strict();

    const Zpagination = z
        .object({
            page: z
                .preprocess(
                    (val) => parseInt(z.string().parse(val), 10),
                    z.number({ invalid_type_error: "page must be number" })
                )
                .default(0)
                .optional(),
            limit: z
                .preprocess(
                    (val) => parseInt(z.string().parse(val), 10),
                    z.number({ invalid_type_error: "limit must be number" })
                )
                .default(20)
                .optional(),
            search: z
                .string()
                .regex(/^[a-zA-Z0-9._-]+(?:\s[a-zA-Z0-9._-]+)*$/)
                .optional(),
            _sort: z.enum(["title", "category"]).optional(),
            _order: z.enum(["asc", "desc"]).default("asc").optional(),
        })
        .strict();
    return {
        ZNewAdd,
        ZUpdate,
        ZGetId,
        ZDelete,
        Zpagination,
    };
})();

export default schema;
