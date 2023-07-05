import { z } from 'zod';

const schema = (() => {

    const ZString = z.string();
    const title = z.string().min(1);
    const description = z.string();
    const product_category_id = z.string().uuid();
    const landing_image = z.string().uuid();

    const ZNewAdd = z.object({
        title: title,
        description: description.optional(),
        product_category_id: product_category_id,
        landing_image: landing_image,
        media_id: z.array(z.string().uuid()),
    }).strict();

    const ZUpdate = z.object({
        id: ZString.uuid(),
        title: title.optional(),
        description: description.optional(),
        product_category_id: product_category_id,
        landing_image: landing_image,
        media_id: z.array(z.string().uuid()),
        status: z.boolean().optional(),
    }).strict()

    const ZGetId = z.object({
        id: z.string().uuid().optional(),
    }).strict();

    const ZDelete = z.object({
        ids: z.array(z.string().uuid()),
    }).strict();

    const Zpagination = z.object({
        page: z.preprocess((val) => parseInt(z.string().parse(val), 10), z.number({ invalid_type_error: "page must be number" })).default(0),
        limit: z.preprocess((val) => parseInt(z.string().parse(val), 10), z.number({ invalid_type_error: "limit must be number" })).default(10),
        search: z.string().regex(/^[a-zA-Z0-9._-]+$/).optional()
    }).strict()
    return {
        ZNewAdd,
        ZUpdate,
        ZGetId,
        ZDelete,
        Zpagination
    };
})();

export default schema;
