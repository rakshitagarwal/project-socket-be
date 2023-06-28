export interface ItokenPersister {
    public_key: string
    access_token: string
    refresh_token: string
    ip_address: string
    user_agent: string
    user_id: string
}

export interface ItokenQuery{
    access_token?: string
    refresh_token?: string
    user_id?: string
}