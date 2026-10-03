import React, { useState, useRef, useEffect } from "react";
import { api } from "../services/api";
import { useToast } from "./Toast";
import {
  Sparkles,
  X,
  Send,
  Plus,
  Bot,
  User,
  Copy,
  RotateCcw,
  Check,
} from "lucide-react";

export default function AiAssistant({ addToCart, getQtyForId }) {
  const { push } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "ai",
      text: "Namaste! 🙏 I'm Swag Chef AI, your personal culinary concierge. What are you craving today? I can suggest dishes by mood, diet, or budget, and add them directly to your cart!",
      quickChips: [
        "🌶️ Spicy non-veg starters",
        "🥗 Pure veg under ₹300",
        "🍕 Best cheesy pizza",
        "🍚 Royal dum biryani",
        "🏷️ Best coupon codes",
      ],
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await api("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: textToSend.trim() }),
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply || "Here are great choices for you!",
        recommendations: data.recommendations || [],
        coupons: data.coupons || [],
        quickChips: data.quickReplies || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Assistant Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "Oops! I had trouble connecting to the master kitchen. But our delicious menu is always ready!",
          quickChips: ["Browse full menu", "Check offers"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    push({ message: `Copied coupon ${code}!`, variant: "success" });
    setTimeout(() => setCopiedCode(""), 2500);
  };

  const handleQuickAdd = (dish) => {
    if (addToCart) {
      addToCart(dish);
      push({ message: `Added ${dish.name} to cart!`, variant: "success" });
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: "Chat refreshed! How can I satisfy your appetite right now?",
        quickChips: [
          "🌶️ Spicy non-veg starters",
          "🥗 Pure veg under ₹300",
          "🍕 Best cheesy pizza",
          "🍚 Royal dum biryani",
          "🏷️ Best coupon codes",
        ],
      },
    ]);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          className="ai-floating-trigger"
          onClick={() => setIsOpen(true)}
          title="Chat with Swag Chef AI"
          aria-label="Open AI Assistant"
        >
          <div className="ai-trigger-sparkle">
            <Sparkles size={18} />
          </div>
          <span className="ai-trigger-text">Ask Chef AI</span>
          <span className="ai-trigger-badge">NEW</span>
        </button>
      )}

      {/* CHAT POPUP WINDOW */}
      {isOpen && (
        <div className="ai-chat-window" role="dialog" aria-modal="true">
          {/* HEADER */}
          <div className="ai-chat-header">
            <div className="ai-profile-left">
              <div className="ai-avatar-badge">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="ai-bot-name">Swag Chef AI ✨</h3>
                <span className="ai-bot-status">
                  <span className="status-online-dot" /> Online Concierge
                </span>
              </div>
            </div>

            <div className="ai-header-actions">
              <button
                className="ai-icon-btn"
                onClick={handleResetChat}
                title="Reset conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                className="ai-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* MESSAGES BODY */}
          <div className="ai-messages-body">
            {messages.map((m) => (
              <div key={m.id} className={`ai-message-row ${m.sender === "user" ? "user-row" : "bot-row"}`}>
                {m.sender === "ai" && (
                  <div className="bot-avatar-mini">
                    <Bot size={15} />
                  </div>
                )}

                <div className={`ai-bubble ${m.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
                  <p className="bubble-text">{m.text}</p>

                  {/* RECOMMENDED DISHES CARDS */}
                  {m.recommendations?.length > 0 && (
                    <div className="ai-recommendations-list">
                      {m.recommendations.map((dish) => {
                        const inCartQty = getQtyForId ? getQtyForId(dish._id) : 0;
                        return (
                          <div key={dish._id} className="ai-dish-card">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="ai-dish-img"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
                              }}
                            />
                            <div className="ai-dish-info">
                              <div className="ai-dish-tag-row">
                                <div className={`diet-indicator ${dish.isVeg ? "diet-veg" : "diet-nonveg"}`}>
                                  <span className="diet-dot" />
                                </div>
                                <span className="ai-dish-cat">{dish.category}</span>
                              </div>
                              <h4 className="ai-dish-title">{dish.name}</h4>
                              <span className="ai-dish-price">₹{dish.price}</span>
                            </div>

                            <button
                              className="btn-ai-add-cart"
                              onClick={() => handleQuickAdd(dish)}
                              title="Add to cart"
                            >
                              <Plus size={14} />
                              <span>{inCartQty > 0 ? `(${inCartQty})` : "Add"}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* SUGGESTED COUPONS */}
                  {m.coupons?.length > 0 && (
                    <div className="ai-coupons-row">
                      {m.coupons.map((c) => (
                        <button
                          key={c}
                          className="ai-coupon-pill"
                          onClick={() => handleCopyCoupon(c)}
                          title="Click to copy coupon code"
                        >
                          {copiedCode === c ? <Check size={12} /> : <Copy size={12} />}
                          <code>{c}</code>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* QUICK SUGGESTION CHIPS */}
                  {m.quickChips?.length > 0 && (
                    <div className="ai-quick-chips-wrap">
                      {m.quickChips.map((chip, idx) => (
                        <button
                          key={idx}
                          className="ai-chip-btn"
                          onClick={() => handleSend(chip)}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {m.sender === "user" && (
                  <div className="user-avatar-mini">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="ai-message-row bot-row">
                <div className="bot-avatar-mini">
                  <Bot size={15} />
                </div>
                <div className="ai-bubble bot-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <form
            className="ai-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Ask Chef AI (e.g. cheesy pizza, veg biryani)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="ai-send-btn"
              disabled={!input.trim() || loading}
              aria-label="Send message to AI"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
