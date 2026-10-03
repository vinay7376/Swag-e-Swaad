require("dotenv").config();

const mongoose = require("mongoose");
const Food = require("./models/Food");

const foodItems = [
  {
    name: "Margherita Pizza",
    description: "Classic cheesy delight loaded with 100% mozzarella, fresh basil, and signature Italian herb sauce.",
    price: 299,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80",
    category: "Pizza",
    isVeg: true,
    rating: 4.6,
    isAvailable: true,
    tags: ["Bestseller", "Cheesy"],
  },
  {
    name: "Farmhouse Supreme Pizza",
    description: "Loaded with bell peppers, crisp capsicum, black olives, sweet golden corn, and gooey mozzarella.",
    price: 349,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    category: "Pizza",
    isVeg: true,
    rating: 4.7,
    isAvailable: true,
    tags: ["Chef's Special", "Veg"],
  },
  {
    name: "Chicken Tikka",
    description: "Juicy boneless chicken chunks marinated in yogurt & tandoori spices, char-grilled to smoky perfection.",
    price: 269,
    image: "/assets/Chicken Tikka.png",
    category: "Starters",
    isVeg: false,
    rating: 4.8,
    isAvailable: true,
    tags: ["Bestseller", "Tandoori"],
  },
  {
    name: "Chicken Dum Biryani",
    description: "Royal slow-cooked basmati rice infused with aromatic saffron, herbs, and tender spiced chicken pieces.",
    price: 289,
    image: "/assets/Chicken Biryani.png",
    category: "Biryani",
    isVeg: false,
    rating: 4.9,
    isAvailable: true,
    tags: ["Chef's Special", "Royal"],
  },
  {
    name: "Hyderabadi Veg Biryani",
    description: "Fragrant basmati rice layered with garden-fresh veggies, caramelized onions, mint, and royal spices.",
    price: 219,
    image: "/assets/Veg Biryani.png",
    category: "Biryani",
    isVeg: true,
    rating: 4.5,
    isAvailable: true,
    tags: ["Popular", "Aromatic"],
  },
  {
    name: "Crispy Veg Paneer Burger",
    description: "Crispy golden paneer patty topped with fresh iceberg lettuce, tomatoes, and creamy tandoori mayo.",
    price: 159,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
    category: "Burgers",
    isVeg: true,
    rating: 4.4,
    isAvailable: true,
    tags: ["Crispy", "Popular"],
  },
  {
    name: "Juicy Crispy Chicken Burger",
    description: "Golden fried chicken breast fillet layered with crunchy lettuce, melted cheese, and smoky chipotle sauce.",
    price: 189,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80",
    category: "Burgers",
    isVeg: false,
    rating: 4.7,
    isAvailable: true,
    tags: ["Bestseller", "Crunchy"],
  },
  {
    name: "Cheese Garlic Bread",
    description: "Freshly baked artisan baguette brushed with herbed garlic butter and smothered in bubbling mozzarella.",
    price: 149,
    image: "/assets/Cheese Garlic Bread.png",
    category: "Snacks",
    isVeg: true,
    rating: 4.5,
    isAvailable: true,
    tags: ["Bestseller", "Cheesy"],
  },
  {
    name: "Tandoori Chicken Wings",
    description: "Crisp & smoky flame-grilled wings tossed in a spicy tandoori glaze, served with fresh mint chutney.",
    price: 249,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
    category: "Starters",
    isVeg: false,
    rating: 4.6,
    isAvailable: true,
    tags: ["Spicy", "Non-Veg"],
  },
  {
    name: "Chocolate Lava Cake",
    description: "Decadent warm dark chocolate sponge with an irresistibly rich, molten chocolate center.",
    price: 129,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    category: "Desserts",
    isVeg: true,
    rating: 4.9,
    isAvailable: true,
    tags: ["Sweet", "Decadent"],
  },
  {
    name: "Cold Brew Iced Coffee",
    description: "Slow-steeped Arabica coffee blended with chilled creamy milk, crushed ice, and rich mocha drizzle.",
    price: 119,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
    category: "Beverages",
    isVeg: true,
    rating: 4.4,
    isAvailable: true,
    tags: ["Chilled", "Refreshing"],
  },
  {
    name: "Paneer Tikka Roll",
    description: "Soft flaky paratha stuffed with marinated chargrilled paneer cubes, crunchy onions, and tangy mint mayo.",
    price: 169,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
    category: "Snacks",
    isVeg: true,
    rating: 4.5,
    isAvailable: true,
    tags: ["Rolls", "Street Food"],
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
      console.log(`- [${food.isVeg ? "VEG" : "NON-VEG"}] [${food.category}] ${food.name}`);
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