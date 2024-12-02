import { FilterQuery,PipelineStage, Types } from "mongoose";
import { pagination } from "../utils/pagination/pagination";
import {Sales} from '../model/sales.model';
import { CustomError } from "../core/ApiError";
import {ICarsFilter} from './users-collection.service';

export interface CarMakeQuery {
    category?:string;
    year?: string;
}

class BulletBoardService {
    private commonListQuery = (
        matchQuery: FilterQuery<CarMakeQuery>,
        userId?:Types.ObjectId,
        type?: 'filter' | 'list' | 'search'
    ) => {
        const pipeline : PipelineStage[]=[];
        if(type === 'filter' || type === 'search'){
            pipeline.push(
                {
                    $lookup:{
                        from: 'cars',
                        localField: 'carId',
                        foreignField: '_id',
                        pipeline:[{$match: matchQuery}],
                        as: 'carsData'
                    },
                },
                {
                    $unwind:{
                        path: '$carsData',
                    }
                }
            );
        }

        //user collection data query
        pipeline.push(
            {
                $lookup:{
                    from: 'usercollections',
                    localField:'collectionId',
                    foreignField: '_id',
                    as:'collectionDetails',
                },
            },
            {
                $unwind:{
                    path: '$collectionDetails',
                },
            }
        );

        //wishlist data pipeline query
        pipeline.push({
            $lookup:{
                from:'users',
                localField:'_id',
                foreignField:'wishlist',
                as:'wishlistData',
            },
        });
        //seller data query
        pipeline.push(
            {
                $lookup:{
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                password:0,
                                accessToken:0,
                            },
                        },
                    ],
                    as: 'sellerData',
                },
            },
            {
                $unwind:{
                    path:'$sellerData',
                    preserveNullAndEmptyArrays: true,
                },
            }
        );

        //cart data query
        pipeline.push(
            {
                $lookup: {
                    from: 'carts',
                    localField: '_id',
                    foreignField: 'saleId',
                    as:'carsData',
                },
            },
            {
                $unwind:{
                    path:'$cartData',
                    preserveNullAndEmptyArrays:true,
                },
            }
        );

        //adding fields based on condition 
        
    }
}