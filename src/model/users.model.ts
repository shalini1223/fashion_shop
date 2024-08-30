import mongoose, {Document,Schema,Types} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserModel extends Document {
    _id: Types.ObjectId;
    userName: string;
    userType: string;
    email: string;
    password: string;
    emailVerified: boolean;
    accessToken:string;
    wishlist:Types.ObjectId[];
    comparePassword(password:string): Promise<boolean>;
    profileImage: string;
}

const userSchema: Schema<IUserModel>=new Schema(
    {
        userName:{
            type:String,
        },
        userType:{
            type:String,
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        emailVerified:{
            type:Boolean,
        },
        accessToken:{
            type:String,
        },
        wishlist:{
            type:[mongoose.Schema.Types.ObjectId],
        },
        profileImage:{
            type:String,
        },

    },
    {
        timestamps:true, versionKey:false
    }
);
//pre hook to encrpt passwrd befr save
userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

//compare password method
userSchema.methods.comparePassword=async function(password:string): Promise<boolean> {
    return await bcrypt.compare(password,this.password);
};

const User = mongoose.model<IUserModel>('User',userSchema,'users');
export {User};
    