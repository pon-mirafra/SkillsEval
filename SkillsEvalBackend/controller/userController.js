import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorResponse.js";
import { User } from "../models/userModal.js";
// import { deleteFromCloud, uploadFiletoCloud } from "../utils/uploadCloud.js";
import jwt from "jsonwebtoken";

const generateaccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "user not found ");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateAccessToken();

    User.refreshToken = refreshToken;

    User.save({ validaBeforeSave: false }); // not validating any data before saving because  we have already validating in line 76

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while creating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("here1>>>");
  const { email, username, password, fullname } = req.body;
  if (!firstName || !lastName || !password || !username || !email || !roleId) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "user already exists");
  }

  console.log(req.files, "files");

  // const avatarLocalPath = await req.files.avatar[0]?.path;
  // const coverLocalPath = await req.files.coverImage[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "avatar file is missing");
  // }

  // const avatarUrl = await uploadFiletoCloud(avatarLocalPath);
  // console.log(avatarUrl);
  // let coverImageUrl = "";
  // if (coverLocalPath) {
  //   coverImageUrl = await uploadFiletoCloud(coverLocalPath);
  // }
  // console.log(coverImageUrl);
  try {
    const user = await User.create({
      fullName: `${firstName}${lastName}`,
      // coverImage: coverImageUrl.url,
      // avatar: avatarUrl.url,
      email,
      username: username.toLowerCase(),
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(500, "something went wrong while register a user");
    }

    return res
      .status(201)
      .json(new apiResponse(201, createdUser, "user register successfully"));
  } catch (error) {
    console.log("user creation failed", error);
    // if (avatarUrl) {
    //   await deleteFromCloud(avatarUrl?.public_id);
    // }

    // if (coverImageUrl) {
    //   await deleteFromCloud(coverImageUrl?.public_id);
    // }

    throw new ApiError(
      500,
      "something went wrong while register a user and image was deleted"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (email || username || password) {
    throw new ApiError(404, "All fields are required");
  }

  const user = User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "user not found ");
  }

  const ispasswordCorrect = User.isPasswordCorrect(password);

  if (!ispasswordCorrect) {
    throw new ApiError(404, "Invalid user credentails ");
  }

  const { accessToken, refreshToken } = await generateaccessAndRefreshToken(
    user?._id
  );

  const loggedinUser = await User.findById(user._id).select(
    "-password, -refreshToken"
  );

  if (!loggedinUser) {
    throw new ApiError(404, "loggedin failed");
  }

  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
  };

  res
    .status(200)
    .cookie("accesstoken", accessToken, option)
    .cookie("refreshtoken", refreshToken)
    .json(new apiResponse(200, loggedinUser, "user loggedin successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { incomingRefreshToken } = req.body;

  if (!incomingRefreshToken) {
    throw new ApiError(404, "All fields are required");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = User.findById(decodedToken?._id);

    if (!incomingRefreshToken) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (incomingRefreshToken != user.refreshAccessToken) {
      throw new ApiError(401, "invalid refresh token");
    }

    const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
    };
    const { accessToken, refreshToken: newRefreshToken } =
      await generateaccessAndRefreshToken(user?._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshtoken", newRefreshToken, option)
      .json(
        new apiResponse(
          200,
          {
            accessToken: accessToken,
            refreshAccessToken: newRefreshToken,
            option,
          },
          "access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating new access token"
    );
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
  };

  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new apiResponse(200, options, "user logout successfully"));
});

// const changeCurrentPassword = asyncHandler(async (req, res) => {
//   const { oldPassword, newPassword } = req.body;

//   const user = await User.findById(req.user._id);
//   const ispasswordvalid = await User.isPasswordCorrect(user.password);

//   if (!ispasswordvalid) {
//     throw new ApiError(401, "old password is incorrect");
//   }

//   User?.password = newPassword;

//   await User.save({ validaBeforeSave: false });
//   return res
//     .status(200)
//     .json(new apiResponse(200, {}, "password updated sucessfully"));
// });

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "password updated sucessfully"));
});

const updateAccount = asyncHandler(async (req, res) => {
  const { fullname } = req.body;

  if (!fullname) {
    throw new ApiError(401, "fullname is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullName: fullname } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new apiResponse(200, {}, "user account details updated successfully")
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarlocalPath = req.file.path;
  if (!avatarlocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadFiletoCloud(avatarlocalPath);

  if (!avatar?.url) {
    throw new ApiError(400, "something went wrong in cloud upload");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar?.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "cover image file is required");
  }

  const coverImage = await uploadFiletoCloud(coverImageLocalPath);

  if (!coverImage?.url) {
    throw new ApiError(400, "something went wrong in cloud upload");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage?.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "cover image updated successfully"));
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  // changeCurrentPassword,
  getCurrentUser,
  updateAccount,
  updateUserAvatar,
  updateUserCoverImage,
};
