const Food = require("../models/Food");

// AI Foodie Concierge & Smart Recommendation Engine
exports.getAiRecommendation = async (req, res, next) => {
  try {
    const { message = "", budget, isVegOnly } = req.body;
    const query = message.toLowerCase().trim();

    // Fetch all active food items from database
    const allFoods = await Food.find({ isAvailable: true });

    let matchedFoods = [...allFoods];
    let replyText = "";
    let suggestedCoupons = [];
    let quickReplies = [];

    // 1. Check for Coupon/Offer queries
    if (
      query.includes("coupon") ||
      query.includes("discount") ||
      query.includes("offer") ||
      query.includes("code") ||
      query.includes("deal")
    ) {
      replyText =
        "Here are today's top savings coupons! 🎉 Apply them at checkout for instant discounts:\n" +
        "• 🏷️ **SAVE10** — 10% OFF on your entire order\n" +
        "• 🏷️ **FLAT50** — Flat ₹50 OFF on orders above ₹299\n" +
        "• 🏷️ **FREESHIP** — 100% Free Express Delivery";
      suggestedCoupons = ["SAVE10", "FLAT50", "FREESHIP"];
      quickReplies = ["Top rated dishes", "Under ₹200 snacks", "Biryani specials"];
      return res.json({
        success: true,
        reply: replyText,
        recommendations: allFoods.slice(0, 2),
        coupons: suggestedCoupons,
        quickReplies,
      });
    }

    // 2. Veg / Non-Veg Filtering
    const wantsVeg =
      isVegOnly ||
      query.includes("veg") ||
      query.includes("shakahari") ||
      query.includes("paneer") ||
      query.includes("pure veg");
    const wantsNonVeg =
      query.includes("non-veg") ||
      query.includes("non veg") ||
      query.includes("chicken") ||
      query.includes("meat") ||
      query.includes("wings");

    if (wantsVeg && !wantsNonVeg) {
      matchedFoods = matchedFoods.filter((f) => f.isVeg === true);
    } else if (wantsNonVeg) {
      matchedFoods = matchedFoods.filter((f) => f.isVeg === false);
    }

    // 3. Category & Taste Profiling
    if (query.includes("biryani") || query.includes("rice")) {
      matchedFoods = matchedFoods.filter((f) => f.category === "Biryani");
      replyText = "Craving royal flavours? 🍚 Here are our slow-cooked dum biryani masterpieces!";
      quickReplies = ["Add a cold beverage", "Show desserts", "Check coupon codes"];
    } else if (query.includes("pizza") || query.includes("cheese")) {
      matchedFoods = matchedFoods.filter(
        (f) => f.category === "Pizza" || f.tags?.includes("Cheesy")
      );
      replyText = "Nothing beats hot, bubbling cheese! 🍕 Check out our artisan pizzas and cheesy breads:";
      quickReplies = ["Veg pizzas", "Add garlic bread", "Apply SAVE10 code"];
    } else if (query.includes("burger")) {
      matchedFoods = matchedFoods.filter((f) => f.category === "Burgers");
      replyText = "Juicy, crunchy and satisfying! 🍔 Here are our top burgers for you:";
      quickReplies = ["Add extra cheese", "Show starters", "Under ₹200"];
    } else if (
      query.includes("spicy") ||
      query.includes("tikka") ||
      query.includes("tandoori") ||
      query.includes("starter")
    ) {
      matchedFoods = matchedFoods.filter(
        (f) => f.category === "Starters" || f.tags?.includes("Spicy") || f.tags?.includes("Tandoori")
      );
      replyText = "Looking for that fiery kick? 🌶️ Our smoky tandoori starters will hit the spot!";
      quickReplies = ["Biryani combo", "Cool down with cold coffee", "View coupon"];
    } else if (
      query.includes("dessert") ||
      query.includes("sweet") ||
      query.includes("meetha") ||
      query.includes("cake")
    ) {
      matchedFoods = matchedFoods.filter((f) => f.category === "Desserts");
      replyText = "Sweet tooth calling? 🍰 Savor our rich, decadent desserts!";
      quickReplies = ["Cold brew coffee", "Back to main menu", "View cart"];
    } else if (
      query.includes("drink") ||
      query.includes("beverage") ||
      query.includes("coffee") ||
      query.includes("thanda")
    ) {
      matchedFoods = matchedFoods.filter((f) => f.category === "Beverages");
      replyText = "Chilled refreshment! 🥤 Pair your meal with our slow-steeped Arabica cold brew:";
      quickReplies = ["Pair with snacks", "Show pizzas", "Apply discount"];
    }

    // 4. Budget constraints
    if (budget || query.includes("under") || query.includes("cheap") || query.includes("sasta")) {
      let maxCost = Number(budget) || 200;
      if (query.includes("200")) maxCost = 200;
      if (query.includes("300")) maxCost = 300;
      if (query.includes("150")) maxCost = 150;

      const budgetFiltered = matchedFoods.filter((f) => f.price <= maxCost);
      if (budgetFiltered.length > 0) {
        matchedFoods = budgetFiltered;
        replyText = `Pocket-friendly feast! 💰 Here are delicious options strictly under ₹${maxCost}:`;
      }
    }

    // 5. Default smart recommendation if no specific match
    if (!replyText) {
      if (matchedFoods.length === 0) {
        matchedFoods = allFoods.slice(0, 3);
        replyText =
          "I couldn't find an exact match for that, but here are our highest rated chef recommendations today! ⭐";
      } else {
        replyText =
          "Great taste! 🍽️ Based on your preferences, here is the perfect recommendation handpicked for you:";
      }
      quickReplies = ["Pure Veg options", "Spicy non-veg specials", "Under ₹200 snacks", "Offers & coupons"];
    }

    // Sort by rating and pick top 3
    matchedFoods.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const recommendations = matchedFoods.slice(0, 3);

    return res.json({
      success: true,
      reply: replyText,
      recommendations,
      coupons: ["SAVE10", "FLAT50"],
      quickReplies: quickReplies.length > 0 ? quickReplies : ["Under ₹200", "Biryani specials", "Cheesy pizzas"],
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    next(error);
  }
};
