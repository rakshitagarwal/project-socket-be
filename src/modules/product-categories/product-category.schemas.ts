import { z } from 'zod';

const schema = (() => {

    const ZString = z.string();
    const title = z.string().min(1);

    const ZNewAdd = z.object({
        title: title,
    });

    const ZUpdate = z.object({
        id: ZString.uuid(),
        title: title.optional(),
        status: z.boolean().optional(),
    })
    const ZGetId = z.object({
        id: z.string().uuid().optional(),
    });

    return {
        ZNewAdd,
        ZUpdate,
        ZGetId
    };
})();

export default schema;
