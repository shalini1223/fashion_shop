import {NextFunction, Request,Response} from 'express';
import asyncHandler from '../../helpers/asyncHandler';
import { AuthError } from '../../core/ApiError';
import {ERROR} from '../../constant';
import jwtHandler, {JWT} from '../../core/jwtHandler';
import { Logger } from 'winston';
import {IUserModel,User} from '../../model/users.model';

export interface Customerequest extends Request {
    user?:IUserModel;
    verifyToken: JWT;
};

class AuthHandler {
    private validateUser = async (accessToken :string, verifyToken: JWT)=>{
        const userData = await User.findOne({
            accessToken,
            email: verifyToken.email,
        });
        if(!userData) throw new AuthError(ERROR.LOGIN_FIRST);

        //check if token belogs to current user
        if(verifyToken.email != userData.email) throw new AuthError(ERROR.ACCESSTOKEN_MISMATCH);

        return userData;
    };
}