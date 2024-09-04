import mongoose , {Document, Schema, Types} from 'mongoose';

export interface IClothesModel extends Document {
    _id: Types.ObjectId;
    versionName:string;
    category: string;
    categoryImage: string;
    year:string;
}

const clothesSchema :Schema<IClothesModel> = new Schema(
    {
        versionName:{
            type:String,
        },
        category:{
            type:String,
        },
        categoryImage:{
            type:String,
        },
        year:{
            type:String,
        }
    },
    {timestamps:true, versionKey:false}
);

const ClothesData = mongoose.model<IClothesModel>('ClothesData',clothesSchema, 'clothes_data');
export {ClothesData};
