import mongoose from 'mongoose';
import {logger} from '..';

const connectDb = async () =>{
    try{
const DB_URI = 'http://localhost:1000/fashion';
const dbInstance = await mongoose.connect(DB_URI);
logger?.info('DATEABSE CONNECTEDD');
    }catch(err){
        logger?.error(`MONGODB connection Failed : ${err}`);
    }
}

export default connectDb;