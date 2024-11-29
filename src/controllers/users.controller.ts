import {Request , Response} from 'express';
import asyncHandler from '../helpers/asyncHandler';
import ResponseHandler from '../helpers/responseHandler';
import {UserService} from '../services/users.service';
import { User } from '../model/users.model';
import { CustomError } from '../core/ApiError';
// import {User} from '../models/users.model';

class UserController extends ResponseHandler{
    register = asyncHandler(async (req:Request,res:Response)=>{
        const {email, password}= req.body;

        const userService = new UserService();
        const response= await userService.registerService(email,password);

        await this.sendResponse(response, res, response.message);
    });
    login = asyncHandler(async (req:Request,res:Response) =>{
        const {pushToken = 'abcd', email,password} =req.body;

        const userData = await User.findOne({email, isActive:true,isDelete:false});
        if(!userData) throw new CustomError('Email is not register with us');

        const userService = new UserService();
        const response = await userService.loginService(userData,password,pushToken);
        
        await this. sendResponse(response,res);
    })

}

export {UserController};