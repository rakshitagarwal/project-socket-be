import { z } from 'zod';

const schema = (() => {

    // const ZString = z.string();

    const ZNewAdd = z.object({
        title: z.string().min(1, 'title must be at least one characters long'),
    }).strict();

    const ZUpdate = z.object({
        title: z.string().min(1, 'title must be at least one characters long').optional(),
        status: z.boolean().optional(),
    }).strict()

    const ZGetId = z.object({
        id: z.string().uuid().optional(),
    });
    const ZDelete = z.object({
        ids: z.array(z.string().uuid().min(1)),
    }).strict();

    return {
        ZNewAdd,
        ZUpdate,
        ZGetId,
        ZDelete
    };
})();

export default schema;
