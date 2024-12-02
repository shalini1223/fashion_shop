import AWS from 'aws-sdk';

//set the region 
const region = 'ca-central-2';
const secretName = 'fashion-dev';

const secretsMananger = new AWS.secretsMananger({
    region,
});

//function to retrieve secret values
export const getSecret = async (): Promise<string> =>{
try{
    const data = await secretsMananger.getSecretValue({secretId: secretName}).promise();
    if(!data.SecretString) {
        throw new Error('Secret not found in response!');
    }
        process.env={...process.env,...JSON.parse(data.SecretString)};
        return data.SecretString;
    }catch(error){
        throw error;
    }
};