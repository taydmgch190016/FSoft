import mongoose, { InferSchemaType, } from 'mongoose';
const { ObjectId } = mongoose.Schema;

const chatbox = new mongoose.Schema(
  {
    accountId: {
      type: ObjectId,
    },
    message : {
        type: String,
    },
    fullname : {
        type: String,
    },
    email : {
        type: String,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model('chatbox', chatbox);
