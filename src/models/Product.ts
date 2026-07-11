import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
}

export interface IProductDocument extends IProduct, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [120, "Product name cannot exceed 120 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { timestamps: true }
);

const Product: Model<IProductDocument> =
  mongoose.models.Product ??
  mongoose.model<IProductDocument>("Product", ProductSchema);

export default Product;
