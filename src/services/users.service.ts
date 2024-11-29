import { IUserModel, User } from "../model/users.model";
import { CustomError } from "../core/ApiError";
import jwtHandler from "../core/jwtHandler";
import { PipelineStage,Types } from "mongoose";

class UserService {
  registerService = async (email: string, password: string) => {
    const isExist = await User.findOne({ email });
    if (isExist) throw new CustomError("User already exists");
    const userData = new User({ email, password });
    await userData.save();

    if (!userData) throw new CustomError("something went wrong");

    const token = jwtHandler.createJwtToken({
      email,
      userId: userData._id,
      // userType: 'User',
    });

    const createdUser = await User.findOneAndUpdate(
      { _id: userData._id },
      { $set: { accessToken: token } }
    );

    return { createdUser, message: "User created Success" };
  };

  loginService = async (
    userData: IUserModel,
    password: string,
    pushToken: string
  ) => {
    const isMatched = await userData.comparePassword(password);
    if (!isMatched) throw new CustomError("Invalid email or password");

    const token = jwtHandler.createJwtToken({
      email: userData.email,
      userId: userData._id,
    //   userType: "User",
    });

    const updtaedUser = await User.findOneAndUpdate(
      { _id: userData._id },
      {
        $set: {
          accessToken: token,
          pushToken,
        },
      },
      {
        new: true,
        projection: { password: 0 },
      }
    );

    if (!updtaedUser) throw new CustomError("User data not updated");
    return updtaedUser;
  };

  getProfileService = async (userId?: Types.ObjectId) => {
    const pipeline: PipelineStage[] = [
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "useraddress",
          localField: "_id",
          foreignField: "userId",
          as: "addressData",
        },
      },
      {
        $project: {
          password: 0,
          accessToken: 0,
          addressIds: 0,
        },
      },
    ];

    const results = await User.aggregate(pipeline);
    if (results.length === 0) throw new CustomError("User not exists");
    return results[0];
  };

  editService = async (userData: IUserModel, userId?: Types.ObjectId) => {
    const {
      fullName,
      userName,
      isProfileCompleted,
      countryCode,
      mobileNumber,
      profileImage,
    } = userData;

    const updateBody = {
      ...(fullName && { fullName }),
      ...(userName && { userName }),
      ...(countryCode && { countryCode }),
      ...(mobileNumber && { mobileNumber }),
      ...(profileImage && { profileImage }),
      ...(typeof isProfileCompleted !== "undefined" &&
      isProfileCompleted === false
        ? { isProfileCompleted: false }
        : { isProfileCompleted: true }),
    };

    const updatedData = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateBody },
      {
        new: true,
        projection: {
          password: 0,
          accessToken: 0,
        },
      }
    );
    if (!updatedData) throw new CustomError("Updtaed Data not found");
    return updatedData;
  };
}

export { UserService };
