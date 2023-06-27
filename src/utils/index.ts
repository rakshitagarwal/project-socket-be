import bcrypt from "bcrypt";

export const hashPassword = (password: string) => {
    const hasData = bcrypt.hashSync(password, "10")
    return hasData
}