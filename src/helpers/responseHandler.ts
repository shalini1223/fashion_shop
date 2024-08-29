import {successMsgResponse} from '../core/ApiResponse';
import {Response} from 'express';

abstract class ResponseHandler {
    sendResponse = async(
        response:number | string | object | boolean | [],
        res:Response,
        message?: string
    ) =>{
        const successObj = new successMsgResponse(true,response, message);
        successObj.sendResponse(res);
    };
}

export default ResponseHandler;