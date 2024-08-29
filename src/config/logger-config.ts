import {createLogger,transports,format} from 'winston';
import fs from 'fs';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import {environment,logDirectory} from '.';
import {Environment} from '../constant';

const initLogger = (env?: string) => {
    let dir = logDirectory;
    if(!dir) dir = path.resolve('logs');

    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    const logLevel= env || environment === 'prod' ? 'warn' : 'debug';

    const consoleLogger = new transports.Console({
        level:logLevel,
        format:format.combine(
            format.errors({stack:true}),
            format.prettyPrint(),
            format.colorize({all:true})
        )
    });

    const transportLogger =[];
    if(process.env.NODE_ENV && [Environment.DEVELOPMENT, Environment.STAGING].includes(
        env || process.env.NODE_ENV
    )){
        const dailyRotateFile = new DailyRotateFile({
            level:'error',
            filename: dir + '/%DATE5.log',
            datePattern:'YYYY_MM_DD',
            zippedArchive: true,
            handleExceptions:true,
            maxSize:'20m',
            maxFiles: '14d',
            format: format.combine(format.errors({stack: true}),format.timestamp(), format.json()),
        });
        transportLogger.push(dailyRotateFile , consoleLogger);
    }else {
        transportLogger.push(consoleLogger);
    }
const logger = createLogger({
    transports: transportLogger,
    exceptionHandlers: transportLogger,
    exitOnError: false, //dont exit on handled exception
});

return logger;

};

export {initLogger};
