const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    isVeg: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    tags: { type: [String], default: [] },
    sizes: {
      type: [{ key: { type: String, required: true }, label: String, multiplier: { type: Number, min: 0.1, default: 1 } }],
      default: () => ([{ key: "S", label: "Small", multiplier: 1 }, { key: "M", label: "Medium", multiplier: 1.2 }, { key: "L", label: "Large", multiplier: 1.5 }]),
    },
    addons: { type: [{ key: { type: String, required: true }, label: String, price: { type: Number, min: 0, default: 0 } }], default: () => ([{ key: "cheese", label: "Extra Cheese", price: 30 }, { key: "toppings", label: "Extra Toppings", price: 40 }, { key: "spicy", label: "Extra Spicy", price: 0 }]) },
  },
  {
    timestamps: true,
  }
);

foodSchema.index({ category: 1, isAvailable: 1 });
foodSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Food", foodSchema);
