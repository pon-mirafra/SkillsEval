import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
        type: Number,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },

    fullName: {
      type: String,
      require: true,
      trim: true,
      index: true,
    },

    roleId: {
      type: String,
      enum: ["1", "2", "3"], // 1 = superAdmin, 2 = admin, 3 = candidate,
      required: true,
    },

    avatar: {
      type: String, // cloud url
      require: true,
    },

    password: {
      type: String,
      require: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // this.password = await bcrypt.hash(this.password, 10);

  // next();

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(this.password, 10); // Await the bcrypt.hash() function
    this.password = hashedPassword;
    next(); // Proceed to save after the password is hashed
  } catch (error) {
    next(error); // Pass the error to the next middleware or handler
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // will retun true/false
};

userSchema.methods.generateAccessToken = async function () {
  jwt.sign(
    { _id: this._id, email: this.email, userName: "this.userName" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
