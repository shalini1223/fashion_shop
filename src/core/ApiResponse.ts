import {Response} from 'express';

export enum ResponseType {
    SUCCESS='SUCCESS',
    CREATED='CREATED',
}

export enum ResponseStatus {
    SUCCESS = 200,
    CREATED=201,
}

export class successMsgResponse{
    public message:string;
    public statusCode:number;
    public status:boolean;
    public output ?;
    public time:Date = new Date();
    constructor(
        status:boolean,
        output: [] | object | string | number | boolean =[],
        message :string = ResponseType.SUCCESS,
        statusCode:number= ResponseStatus.SUCCESS
    ){
        this.status=status;
        this.output=output;
        this.message=message;
        this.statusCode=statusCode;
    }
    sendResponse(res:Response) {
        const payload = {
            status:this.status,
            statusCode:this.statusCode,
            message:this.message,
            output:this.output,
            time:this.time
        };
        res.status(this.statusCode).json(payload)
    }
}