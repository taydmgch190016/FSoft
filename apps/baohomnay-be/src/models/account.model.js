import mongoose, { InferSchemaType, } from 'mongoose';
const { ObjectId } = mongoose.Schema;
export const RoleName = {
  ADMIN : 'admin',
  STAFF : 'staff',
  GUEST : 'guest',
}

const account = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    role: {
      type : String,
      enum : Object.values(RoleName),
      maxLength: 32,
      required: true,
    },
    categoryId :{
        type : ObjectId,
        ref : "category"
    },
    googleId :{
      type : String,
  },
    fullname: {
      type: String,
      maxLength: 32,
      required: true,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
      maxLength: 255,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    verify: { 
      type : Boolean,
    }
  },
  {
    timestamps: true,
  }
);


export default mongoose.model('account', account);
