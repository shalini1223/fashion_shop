import jwt, {SignOptions} from 'jsonwebtoken';
import {logger} from '..';
import {AuthError,CustomError} from './ApiError';
import {Types} from 'mongoose';

export interface JWT{
    email?:string;
    userId?: Types.ObjectId;
    userType?:string;
}

interface IPayload {
    userType?: 'Admin | User';
    email:string;
    userId: Types.ObjectId;
}

class JWTHandler {
    createJwtToken = (data:IPayload, options:SignOptions = {expiresIn:'365d'}) =>{
        try{
 if(!process.env.JWT_SECRET_KEY) throw new CustomError('JWT key not configured');
 return jwt.sign(data,process.env.JWT_SECRET_KEY, options);           
        }catch(error){
            logger?.error('#### Error: create jwt toke', JSON.stringify(error));
            throw new CustomError('Error',500);
        }
    };

    verifyToken = (accessToken:string):JWT =>{
        try{
            if(!process.env.JWT_SECRET_KEY) throw new CustomError('JWT key not configured');
            return jwt.verify(accessToken, process.env.JWT_SECRET_KEY) as JWT;

        }catch(error){
            logger?.error('#### Error: create jwt toke', JSON.stringify(error));
            throw new AuthError('Error: AccessToken mismatch',404);
        }
    };
}

export default new JWTHandler();