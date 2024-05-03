export interface RequestWithAuthorization extends Request {
    headers: Request['headers'] & {
        authorization?: string;
    };
}
