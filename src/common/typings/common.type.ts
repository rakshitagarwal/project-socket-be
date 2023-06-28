export interface IResponseBody {
    success: boolean;
    code: number;
    message: string;
    data?: object;
    metadata?: object;
}
