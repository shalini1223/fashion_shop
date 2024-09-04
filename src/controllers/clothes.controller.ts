import {Request , Response} from 'express';
import asyncHandler from '../helpers/asyncHandler';
import ResponseHandler from '../helpers/responseHandler';
import {ClothesService} from '../services/clothes.service';
import {ClothesData} from '../model/clothes.model';

class ClothesController extends ResponseHandler{
  
searchByImage = asyncHandler(async (req:Request,res:Response)=>{
    const {gcpImage, httpImage} = req.body;

    const imageURI = {
        source?:
        {
    gcsImageUri: string;
    imageUri?:string
        }
        {
            imageUri: string;
            gcsImageUri?:string;
        };
        content?:string;
    } ={};

    if(gcpImage)  {
        imageURI.source = {gcsImageUri: gcpImage};
    }else if(httpImage) {
        imageURI.source = {imageUri : httpImage};
    }else if(req.file) {
        const content = fs.readFileSync(req.file.path,'base64');
        imageURI.content = content;
    }else throw new ClientError('Please provide allowed image type');

    const carsService = new clothesService();
    const response = await carsService.searchImageService(imageURI);

    if(typeof response !== 'string'){
        const matchedProducts = response.map((item) => {
            return {productId:item.product?.name?.split('/').pop(),score: item.score};
        });
//find product from db
        const carsData = await ClothesData.find(
            { _id:{$in : matchedProducts.map((item)=> common.convertToObjectId(item.productId))}},
                {},
                {lean:true}
            
        );
        //here merge both data
        const mergedData = matchedProducts.map((product) =>{
            const carsData=carsData.find((car)=>car._id.toString() === product.productId);
            return {...product,...carData};
        });
        if(req.file){
            fs.unlinkSync(req.file.path);
        }
        await this.sendResponse(mergedData,res);

    }else{
        await this.sendResponbse(response,res);
    }
}
}
}


export {ClothesController};