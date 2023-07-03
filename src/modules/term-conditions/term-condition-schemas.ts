import { z } from 'zod'

const create = z.object({
    title: z.string({ invalid_type_error: "title must be string", required_error: "title is required" }).min(1),
    content: z.string({ required_error: "content is required", invalid_type_error: "content must be string" }).min(5)
}).strict()

const update = z.object({
    title: z.string({ invalid_type_error: "title must be string" }).min(1).optional(),
    content: z.string({ invalid_type_error: "content must be string" }).min(5).optional(),
    status: z.boolean({ invalid_type_error: "status must be boolean" }).optional()
}).strict()

const Id=z.object({
    id: z.string({ invalid_type_error: "id must be string", required_error: "id is required" }).min(1),
}).strict()
const terAndConditonSchema = {
    update,
    create,
    Id
}
export default terAndConditonSchema