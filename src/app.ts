import express, {Request,Response,NextFunction} from 'express';
import cors from 'cors';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';

import  {ApiError} from './core/ApiError';
import {logger} from '.';
import router from './routes';


process.on('uncaughtException', (e)=> {
    logger?.error(e);
});

const app= express();

//parser middleware to parse data in json and url form
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//apply cors and helmt middelware
app.use(cors());
app.use(helmet());

app.get('/healthy', (req:Request, res:Response) => res.send('Server is up'));

//basicAuth middelware
app.use(
    basicAuth({
        users:{fashions_and_more:'95rhijk'},
        unauthorizedResponse: 'Access denied',
    })
);

//protect route 
app.get('/v3/health', (req:Request, res:Response)=>{
    res.send('server runnn nupppppppppp');
});

//middleware to log
app.use((req:Request , res: Response, next: NextFunction) => {
    console.log(`Received ${req.method} request at ${req.originalUrl}`);
    if(req.body) console.log( 'Requseted body:', req.body);
    if(req.params) console.log('Requseted params:', req.params);
    if(req.query) console.log('Requested query:',req.query);
    next();
})

//routers
app.use('./api/v1', router);

//catch 404 and forward error
app.use((req:Request,res:Response,next:NextFunction) => next(new Error('Route not Found')));

//middleware error handler
app.use((err:Error, req:Request , res: Response, next:NextFunction) => {
if(err instanceof ApiError) {
    logger?.error(
        `${err.date} - ${err.statusCode} - ${JSON.stringify(err.message)} - ${req.originalUrl}- ${req.method}-${req.ip}`
    );
    ApiError.errorResponse(err,res);
}else{
    if(err.message){
        logger?.error(
            `${new Date()} - ${500} - ${JSON.stringify(err.message)} - ${req.originalUrl} - ${req.method}-${req.ip}`
        );
        res.status(500).json(err.message);
    }else{
        logger?.error(
            `${new Date()} - ${500} - ${'Internal server error'} - ${req.originalUrl} - ${req.method}-${req.ip}`
        );
        res.status(500).json('Internal server error');
    }
    next();
}
});

export default app;
