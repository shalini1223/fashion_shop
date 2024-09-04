import {Request , Response} from 'express';
import asyncHandler from '../helpers/asyncHandler';
import ResponseHandler from '../helpers/responseHandler';
import {UserService} from '../services/users.service';
// import {User} from '../models/users.model';

class UserController extends ResponseHandler{
    register = asyncHandler(async (req:Request,res:Response)=>{
        const {email, password}= req.body;

        const userService = new UserService();
        const response= await userService.registerService(email,password);

        await this.sendResponse(response, res, response.message);
    });

}

export {UserController};