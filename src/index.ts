import dotenv from 'dotenv';
dotenv.config({
    path:'./.env',
});
import {initLogger} from './config/logger-config';

import {port} from './config';

import connectDb from './db';

import app from './app';
import winston from 'winston';

async function initializeApp(){
    try{
        await getSecret();

        await connectDb();
        const Logger = initLogger(process.env.NODE_ENV);

        app.listen(port,() =>{
            console.info(`server runnns on port: ${port}`);
        });
        return Logger;
    }catch(err){
        console.error(err);
    }
}

let logger: winston.Logger | undefined = initLogger();

initializeApp().then((initializedLogger) => {
    logger = initializedLogger;
});
export {logger};