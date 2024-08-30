import {IUserModel, User} from '../model/users.model';
import {CustomError} from '../core/ApiError';
import jwtHandler from '../core/jwtHandler';

class UserService {
    registerService = async (email:string, password:string) =>{
const isExist = await User.findOne({email});
if(isExist) throw new CustomError('User already exists');
const userData = new User({email,password});
await userData.save();

if(!userData) throw new CustomError('something went wrong');

const token= jwtHandler.createJwtToken({
    email,
    userId:userData._id,
    // userType: 'User',
});

const createdUser = await User.findOneAndUpdate(
    {_id:userData._id},
    {$set: {accessToken :token}}
);

return {createdUser ,message:'User created Success'};
    }
}

export {UserService}