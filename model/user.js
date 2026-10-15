import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      required: false,
      trim: true,
    },

    mobile: {
      type: String,
      required: false,
      trim: true,
    },

    address: {
      type: String,
      required: false,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    image:{
      type: String,
      required: false,

    }
  },
  {
    timestamps: true,
    collection: "userdata",
  }
);

export default mongoose.model("userData", userSchema);
