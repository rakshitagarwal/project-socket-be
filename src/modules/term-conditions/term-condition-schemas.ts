import { z } from 'zod'

const create = z.object({
    content: z.string({ required_error: "content is required", invalid_type_error: "content must be string" }).min(5)
}).strict()

const update = z.object({
    content: z.string({ invalid_type_error: "content must be string",required_error: "content is required" }).min(5),
    status: z.boolean({ invalid_type_error: "status must be boolean" }).optional()
}).strict()

const Id = z.object({
    id: z.string({ invalid_type_error: "id must be string", required_error: "id is required" }).min(1),
}).strict()

const pagination = z.object({
    page: z.preprocess((val) => parseInt(val as string), z.number({ invalid_type_error: "page must be number" })).optional(),
    limit: z.preprocess((val) => parseInt(val as string), z.number({ invalid_type_error: "limit must be number" })).optional(),
    search: z.string().regex(/^[a-zA-Z0-9._-]+$/).optional()
}).strict()

const terAndConditonSchema = {
    update,
    create,
    Id,
    pagination
}
export default terAndConditonSchema