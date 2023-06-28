import { z } from 'zod'
const role = z.object({
    title: z.string({ required_error: "title is required", invalid_type_error: "title must be string" }),
})
const roleId = z.object({
    id: z.string({ required_error: "id is required", invalid_type_error: "id must be string" }),
})
const rolepagination = z.object({
    page: z.string({ invalid_type_error: "page must be string" }).optional(),
    limit: z.string({ invalid_type_error: "limit must be string" }).optional(),
    search: z.string().regex(/^[a-zA-Z0-9._-]+$/).optional()
})
const roleSchemas = {
    role,
    roleId,
    rolepagination
}
export default roleSchemas