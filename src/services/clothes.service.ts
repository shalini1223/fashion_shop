import { CustomError } from "../core/ApiError";
import vision, {protos} from '@google-cloud/vision';
import path from 'path';
import fs from 'fs';
import {PipelineStage} from 'mongoose';
import {pagination} from '../utils/pagination/pagination';
import { ClothesData } from "../model/clothes.model";

class ClothesService {
private async writeKeyFile(): Promise<string> {
if(!process.env.GCP_SERVICE_JSON)
    throw new CustomError('GCP_SERVICE_JSON not found in secret keys');

//check file exists
const filePath = path.resolve('keys','gcp-keyfile.json');
if(fs.existsSync(filePath)){
    return filePath;
}

const gcpServiceJson = JSON.parse(process.env.GCP_SERVICE_JSON);
const keyFilePath = path.resolve('keys','gcp-keyFile.json');
fs.writeFileSync(keyFilePath, JSON.stringify(gcpServiceJson,null,2));
return keyFilePath;
}
private getProductSearchClient = async () => {
//create temp file
const filePath= await this.writeKeyFile();
return new vision.ProductSearchClient({
    keyFilename : filePath,
});
};

private getImageAnnotatorClient = async () => {
    const filePath = await this.writeKeyFile();
    return new vision.ImageAnnotatorClient({
        keyFilename: filePath,
    });
};

searchImageService = async (imageURI :{
source?:
{
    gcsImageUri: string;
    imageUri?: string;
}|
{
    imageUri:string;
    gcsImageUri?: string;
};
content? :string;
}): Promise<protos.google.cloud.vision.v1.ProductSearchResults.IResult[] | string> =>{
    const projectId=process.env.PROJECT_ID;
    const location = process.env.LOCATION;
    const productSetId= process.env.PRODUCT_SET_ID;
    const productCategory=process.env.PRODUCT_CATEGORY;

    if(!projectId) throw new CustomError('id required');
    if(!location) throw new CustomError('id required');
    if(!productSetId) throw new CustomError('id required');
    if(!productCategory) throw new CustomError('id required');

    const filter='';

    const productSearchClient = await this.getProductSearchClient();
    const productSetPath =productSearchClient.productSetPath(projectId,location,productSetId);

    const request = {
        image: imageURI,
        features:[{type: protos.google.cloud.vision.v1.Feature.Type.PRODUCT_SEARCH}],
        imageContext:{
            productSearchParams:{
                productSet: productSetPath,
                productCategories:[productCategory],
                filter:filter,
            },
        },
    };
    try{
const ImageAnnotatorClient= await this.getImageAnnotatorClient();
const [response] = await ImageAnnotatorClient.batchAnnotateImages({
    requests:[request],
});

//check if there is an error in response
if(response.responses && response.responses[0].error){
    const errorMessage = response.responses[0].error.message || 'somehting went wtrong whike getting response';
    console.log('errorr:', response.responses[0].error);
    throw new CustomError(errorMessage);
}

//handle sucess response
if(response.responses && response.responses[0]){
    const results= response.responses[0].productSearchResults?.results || 'Something went wrong geeting response';
    return results;
}else{
    throw new CustomError('No results found');
}
    }catch(error){
        console.log('errrrr',error);
        throw new CustomError(`Error durimng image search:${error}`);
    }
};

searchByTextService = async (keyword:string,page:number,limit:number)=>{
const query : PipelineStage[] =[
    {$match:{$or:[{category:{$regex:keyword,$options:'i'}}]}},
];

const results= await pagination.add(ClothesData,query,Number(page), Number(limit)
);
return results;
};
}

export {ClothesService}