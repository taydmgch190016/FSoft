import mongoose, { InferSchemaType, } from 'mongoose';
const { ObjectId } = mongoose.Schema;

const payment = new mongoose.Schema(
  {
    accountId: {
      type: ObjectId,
      ref : 'account',
      unique : true
    },
    billCode : {
        type: String,
    },
    id : {
        type: String,
    },
    orderCode : {
        type: String,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model('payment', payment);
