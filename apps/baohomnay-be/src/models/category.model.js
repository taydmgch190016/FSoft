import mongoose, { InferSchemaType, } from 'mongoose';
const { ObjectId } = mongoose.Schema;
const category = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);


export default mongoose.model('category', category);
