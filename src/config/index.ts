export const environment = process.env.NODE_ENV || 'dev';
export const port = process.env.PORT || '1000';

export const logDirectory = process.env.LOG_DIR;

export const AWS_S3 = {
    S3_Bucket_Name : '',
    AWS_REGION: process.env.AWS_REGION,
    AWS_SECRET: process.env.AWS_SECRET,
};