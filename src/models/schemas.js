import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * commong Schema configuration
 */
const schemaOptions = {
  timestamps: {
    versionKey: false,
    autoIndex: true,
    createdAt: {
      type: Date,
      default: new Date().toUTCString(),
    },
    updatedAt: {
      type: Date,
      default: new Date().toUTCString(),
    },
  },
};

/**
 * module wise models/Schemas
 */

const auctionCategory = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    schemaOptions,
  }
);

const productCategory = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    schemaOptions,
  }
);

const privilageSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    schemaOptions,
  }
);

const roleSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
      default: false,
    },
    Privilage: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Privilage",
    },
  },
  {
    schemaOptions,
  }
);

const rolePrivilage = new Schema(
  {
    Role: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Role",
    },
    Privilage: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Privilage",
    },
  },
  {
    schemaOptions,
  }
);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    schemaOptions,
  }
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
      require: true,
      ref: "User",
    },
  },
  {
    schemaOptions,
  }
);

const productSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    descirption: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    purchasePrice: {
      type: Number,
      require: true,
    },
    sellingPrice: {
      type: Number,
      require: true,
    },
    overHeadCost: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    schemaOptions,
  }
);

const auctionSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    bannerImage: {
      type: String,
    },
    bannerVideo: {
      type: String,
    },
    noOfPlayConsumed: {
      type: Number,
      require: true,
    },
    bidIncrement: {
      type: Number,
      require: true,
    },
    OpeningPrice: {
      type: Number,
      require: true,
    },
    startTime: {
      type: Number,
      require: true,
    },
    endTime: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    NoNewBidderLimit: {
      type: Number,
    },
    status: {
      type: String,
      require: true,
      default: "Active",
      enum: ["Active", "Publish", "Cancel", "Closed"],
    },
    Product: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Product",
    },
    AuctionCategory: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "AuctionCategory",
    },
  },
  {
    schemaOptions,
  }
);

const auctionPreRegisterSchema = new Schema(
  {
    startDate: {
      type: Date,
      require: true,
    },
    participantCount: {
      type: Number,
      require: true,
    },
    participantFees: {
      type: Number,
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
      default: false,
    },
    Auction: {
      type: Schema.Types.ObjectId,
      ref: "Auction",
      require: true,
    },
  },
  {
    schemaOptions,
  }
);

const auctionReultScehma = new Schema(
  {
    noOfTimePreRegistered: {
      type: Number,
      require: true,
    },
    noOfTimeAuctionNotPlayed: {
      type: Number,
      require: true,
    },
    noOfAuctionPlayed: {
      type: Number,
      require: true,
    },
    NoOfTimePostRegistered: {
      type: Number,
      require: true,
    },
    totalPlaysAbsrob: {
      type: Number,
      require: true,
    },
    User: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    Auction: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Auction",
    },
  },
  {
    schemaOptions,
  }
);

const walletSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    walletBalance: {
      type: Number,
      require: true,
    },
    walletAddress: {
      type: Number,
      require: true,
    },
    networkType: {
      type: String,
      require: true,
    },
    chainID: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      require: true,
      default: false,
    },
    User: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  {
    schemaOptions,
  }
);

const transactionSchema = new Schema({
  playConsumend: {
    type: Number,
    require: true,
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
