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
      default: true,
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
    type: {
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
      default: true,
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
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    zip: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    gender: { type: String },
    age: { type: Number },
    mobile: { type: Number },
    profession: { type: String },
    passcode: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    isblock: {
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
    address: {
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
    },
    image: {
      type: [
        {
          type: String,
        },
      ],
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
    vendor: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    IsDeleted: {
      type: Boolean,
      default: true,
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
      type: [
        {
          type: String,
        },
      ],
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
    autoStart: {
      type: Boolean,
      required: true,
      default: true,
    },
    openingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    bot: {
      type: Boolean,
      required: true,
      default: true,
    },
    botMaxPrice: {
      type: Number,
      default: 0,
    },
    registerationStatus: {
      type: Boolean,
      default: true,
    },
    postAuctionStatus: {
      type: Boolean,
      default: true,
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
    state: {
      type: String,
      required: true,
      default: "Active",
      enum: ["Active", "Publish", "Cancel", "Closed"],
    },
    "terms&Condition": {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    IsDeleted: {
      type: Boolean,
      default: true,
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
    endDate: {
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
      default: true,
    },
    IsDeleted: {
      type: Boolean,
      required: true,
      default: true,
    },
    Auction: {
      type: Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
  },
  schemaOptions
);

const auctionPostRegisterSchema = new Schema(
  {
    participantFees: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    IsDeleted: {
      type: Boolean,
      default: true,
    },
    Auction: {
      type: Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
  },
  schemaOptions
);

const auctionResultSchema = new Schema(
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

export const persistence = new Schema({
  publicKey: {
    type: String,
    require: true,
  },
  accessToken: {
    type: String,
    require: true,
  },
  passcode: {
    type: String,
    require: true,
  },
  User: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const model = {
  roleSchema,
  privilageSchema,
  rolePrivilage,
  productCategory,
  auctionCategory,
  userSchema,
  persistence,
  auctionSchema,
  auctionPreRegisterSchema,
  auctionPostRegisterSchema,
};
