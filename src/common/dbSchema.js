import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * commong Schema configuration
 */
const schemaOptions = {
  versionKey: false,
  autoIndex: true,
  timestamps: true,
};

/**
 * module wise models/Schemas
 */

const auctionCategory = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  schemaOptions
);

export const productCategory = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  schemaOptions
);

const privilageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    accessNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  schemaOptions
);

export const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  schemaOptions
);

export const rolePrivilage = new Schema({
  role: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Role",
  },
  module: [
    {
      name: {
        type: String,
        required: true,
      },
      privilageNumber: {
        type: Number,
        required: true,
      },
    },
  ],
});

export const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    Role: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Role",
    },
  },
  schemaOptions
);

const userProfile = new Schema(
  {
    location: {
      type: String,
    },
    addreess: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    avatar: {
      type: String,
    },
    gender: {
      type: String,
    },
    User: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  schemaOptions
);

export const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    overHeadCost: {
      type: Number,
      required: true,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    ProductCategory: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ProductCategory",
    },
  },
  schemaOptions
);

const auctionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
    },
    bannerVideo: {
      type: String,
    },
    noOfPlayConsumed: {
      type: Number,
      required: true,
      default: 0,
    },
    bidIncrement: {
      type: Number,
      required: true,
      default: 0,
    },
    OpeningPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    startTime: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    noNewBidderLimit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      default: "Active",
      enum: ["Active", "Publish", "Cancel", "Closed"],
    },
    Product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    AuctionCategory: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AuctionCategory",
    },
  },
  schemaOptions
);

const auctionPreRegisterSchema = new Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    participantCount: {
      type: Number,
      required: true,
      default: 0,
    },
    participantFees: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    Auction: {
      type: Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
  },
  schemaOptions
);

const auctionReultScehma = new Schema(
  {
    noOfTimePreRegistered: {
      type: Number,
      required: true,
      default: 0,
    },
    noOfTimeAuctionNotPlayed: {
      type: Number,
      required: true,
      default: 0,
    },
    noOfAuctionPlayed: {
      type: Number,
      required: true,
      default: 0,
    },
    noOfTimePostRegistered: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPlaysAbsrob: {
      type: Number,
      required: true,
      default: 0,
    },
    User: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Auction: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Auction",
    },
  },
  schemaOptions
);

const walletSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    walletBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    walletAddress: {
      type: String,
      required: true,
    },
    networkType: {
      type: String,
      required: true,
    },
    chainID: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    User: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  schemaOptions
);

const transactionSchema = new Schema({
  playConsumend: {
    type: Number,
    require: true,
    default: 0,
  },
  status: {
    type: Boolean,
    require: true,
    default: false,
  },
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  Wallet: {
    type: Schema.Types.ObjectId,
    ref: "Wallet",
    require: true,
  },
});

export const model = {
  roleSchema,
  privilageSchema,
  rolePrivilage,
  productCategory,
  userSchema,
};
