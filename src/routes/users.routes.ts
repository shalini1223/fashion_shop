import express from 'express';
import {UserController} from '../controllers/users.controller';
// import userValidation from '../validators/userValidation';

const userRoute = express.Router();

const userController= new UserController();

userRoute.post('/register',userController.register);

export {userRoute};