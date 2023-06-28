import { z } from 'zod';

const schema = (() => {

    const ZString = z.string();
    const title = z.string().min(1);
    const description = z.string()

    const ZNewAdd = z.object({
        title: title,
        description: description

    });

    const ZUpdate = z.object({
        id: ZString.uuid(),
        title: title.optional(),
        description: description.optional(),
        status: z.boolean().optional(),
    })
    const ZGetId = z.object({
        id: z.string().uuid(),
    });

    return {
        ZNewAdd,
        ZUpdate,
        ZGetId
    };
})();

export default schema;
