import { Request, Response, NextFunction } from "express";

type AsyncFunction = (req:Request, res:Response,next:NextFunction)=> Promise<unknown>;

export default (requestHandler:AsyncFunction)=>
    (req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err) =>{
            console.log('AsuncHandler errror:', err);
            return next(err);
        });
    };
