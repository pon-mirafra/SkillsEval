import jwt from "jsonwebtoken";
import { User } from "../models/userModal.js";
import { ApiError } from "../utils/errorResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  const token = req.headers["Authorization"]?.replace("Bearer", "");

  if (!token) {
    throw new ApiError(401, "unauthorized");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "unauthorized");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message ? error.message : "Invalid access token"
    );
  }
});
