import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      // unique: true,
    },
    lastName: {
      type: String,
      required: true,
      // unique: true,
    },
    email: {
      type: String,
      required: true,
    //   unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      // unique: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["seller", "buyer"],
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
