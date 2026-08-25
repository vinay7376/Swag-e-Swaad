require("dotenv").config();

const mongoose = require("mongoose");
const Food = require("./models/Food");

const foodItems = [
  {
    name: "Margherita Pizza",
    description: "Classic cheesy Margherita pizza with fresh tomato and herbs.",
    price: 299,
    image: "https://i.imgur.com/eTmWoAN.png",
    category: "Pizza",
    isVeg: true,
    rating: 4.5,
    isAvailable: true,
    tags: ["pizza", "cheese", "popular"],
  },
  {
    name: "Paneer Burger",
    description: "Delicious crispy paneer burger with fresh vegetables.",
    price: 149,
    image: "https://i.imgur.com/QqVHdRu.png",
    category: "Burgers",
    isVeg: true,
    rating: 4.3,
    isAvailable: true,
    tags: ["burger", "paneer", "veg"],
  },
  {
    name: "Chicken",
    description: "Crispy and delicious chicken snack.",
    price: 99,
    image: "https://i.imgur.com/o8cd4Rw.png",
    category: "Snacks",
    isVeg: true,
    rating: 4.2,
    isAvailable: true,
    tags: ["snacks", "crispy"],
  },
  {
    name: "Chicken Tikka",
    description: "Juicy and flavorful Indian-style chicken tikka.",
    price: 249,
    image: "/assets/Chicken Tikka.png",
    category: "Indian",
    isVeg: false,
    rating: 4.6,
    isAvailable: true,
    tags: ["chicken", "tikka", "indian"],
  },
  {
    name: "Veg Biryani",
    description: "Aromatic basmati rice cooked with fresh vegetables and spices.",
    price: 199,
    image: "/assets/Veg Biryani.png",
    category: "Rice",
    isVeg: true,
    rating: 4.1,
    isAvailable: true,
    tags: ["biryani", "rice", "veg"],
  },
  {
    name: "Masala Chicken Tikka",
    description: "Spicy and flavorful chicken tikka with Indian masala.",
    price: 249,
    image: "/assets/Chicken Biryani.png",
    category: "Rice",
    isVeg: false,
    rating: 4.4,
    isAvailable: true,
    tags: ["chicken", "masala", "spicy"],
  },
  {
    name: "Burger",
    description: "Classic delicious burger with fresh ingredients.",
    price: 129,
    image: "https://i.imgur.com/0umadnY.jpg",
    category: "Drinks",
    isVeg: true,
    rating: 4.0,
    isAvailable: true,
    tags: ["burger", "popular"],
  },
  {
    name: "Cheese Garlic Bread",
    description: "Crispy garlic bread topped with delicious melted cheese.",
    price: 149,
    image: "/assets/Cheese Garlic Bread.png",
    category: "Snacks",
    isVeg: true,
    rating: 4.3,
    isAvailable: true,
    tags: ["garlic", "cheese", "snacks"],
  },
];

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    // Remove existing food records to avoid duplicates
    await Food.deleteMany({});

    // Insert food data
    const foods = await Food.insertMany(foodItems);

    console.log(`✅ ${foods.length} food items inserted successfully`);

    foods.forEach((food) => {
      console.log(`- ${food.name}`);
    });

    await mongoose.connection.close();

    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Food seeding failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedFoods();