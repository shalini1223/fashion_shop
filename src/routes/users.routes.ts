import express from 'express';
import {UserController} from '../controllers/users.controller';
import {uploadFile} from '../middlewares/file-upload';
// import userValidation from '../validators/userValidation';

const userRoute = express.Router();

const userController= new UserController();

userRoute.post('/register',userController.register);

userRoute.post('/searchByImage', uploadFile.single('image'), userController.searchByImage);

export {userRoute};