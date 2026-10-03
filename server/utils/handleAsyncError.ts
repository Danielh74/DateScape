import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export default (fn: AsyncRequestHandler): RequestHandler => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}
