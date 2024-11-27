import type { Request, Response, NextFunction } from "express";
import { IProject } from "../models/Project";
declare global {
    namespace Express {
        interface Request {
            project: IProject;
        }
    }
}
export declare function projectExist(req: Request, res: Response, next: NextFunction): Promise<void>;
