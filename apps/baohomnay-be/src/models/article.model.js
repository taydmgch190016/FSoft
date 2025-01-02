import mongoose, { InferSchemaType, } from 'mongoose';
const { ObjectId } = mongoose.Schema;
const article = new mongoose.Schema(
  {
    accountId : {
        type : ObjectId,
        ref : "account"
    },
    categoryId : {
        type : ObjectId,
        ref : "category"
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date : {
        type : Date,
        require :true,
    },
    likedAccountId : {
        type : Array,
    },
    comment : {
        type : Array
    },
    tags : {
        type : Array
    },
    totalComment : {
        type : Array,
    }
  },
  {
    timestamps: true,
  }
);


export default mongoose.model('article', article);
