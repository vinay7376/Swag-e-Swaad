const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "M",
    },

    addons: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },

    subtotal: {
      type: Number,
      required: true,
    },

    deliveryFee: {
      type: Number,
      default: 29,
    },

    discount: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },

    coupon: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed", "refunded",
      ],
      default: "pending",
    },
    payment: {
      providerOrderId: { type: String, index: true, sparse: true },
      paymentId: { type: String, index: true, sparse: true },
      failureReason: { type: String, default: "" },
    },
    statusHistory: { type: [{ status: String, at: { type: Date, default: Date.now } }], default: () => [{ status: "pending", at: new Date() }] },

    paymentMethod: {
      type: String,
      enum: [
        "cod",
        "online",
      ],
      default: "cod",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model(
  "Order",
  orderSchema
);
