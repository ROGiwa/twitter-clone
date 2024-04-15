import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
    followers: {
      type: Array,
      defaultvalue: [],
    },
    following: {
      type: Array,
      defaultvalue: [],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('user', userSchema);
