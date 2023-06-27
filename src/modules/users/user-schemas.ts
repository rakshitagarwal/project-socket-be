import { z } from 'zod'
const register = z.object({
    first_name: z.string({ invalid_type_error: "first_name must be string" }),
    email: z.string({ required_error: "email is required", invalid_type_error: "email must be string" }).email({ message: "Invalid email address" }).trim().toLowerCase(),
    password: z.string({ invalid_type_error: "Password must be string" }),
    last_name: z.string({ invalid_type_error: "last_name must be string" }),
    role_id: z.string({ invalid_type_error: "role_id must be string", required_error: "role_id is required", }),
    country: z.string({ required_error: "country is required", invalid_type_error: "country must be string" }),
    mobile_no: z.string({ invalid_type_error: "mobile_no must be string" })
})

const emailVerifcation = z.object({
    otp: z.string({ invalid_type_error: "otp must be string", required_error: "otp is required" }),
    email: z.string({ required_error: "email is required", invalid_type_error: "email must be string" }).email({ message: "Invalid email address" }).trim().toLowerCase(),
    otp_type: z.string({ invalid_type_error: "otp_type must be string" }).optional(),
})

const adminLogin = z.object({
    email: z.string({ required_error: "email is required", invalid_type_error: "email must be string" }).email({ message: "Invalid email address" }).trim().toLowerCase(),
    password: z.string({ required_error: "password is required", invalid_type_error: "Password must be string" }),
})

const login = z.object({
    email: z.string({ required_error: "email is required", invalid_type_error: "email must be string" }).email({ message: "Invalid email address" }).trim().toLowerCase(),
})


const userSchemas = {
    register,
    emailVerifcation,
    login,
    adminLogin
}
export default userSchemas