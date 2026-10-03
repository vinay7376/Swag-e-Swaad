import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Package, Clock, MapPin, CreditCard, ChevronRight, ShoppingBag } from "lucide-react";

export function getStatusBadge(status) {
  const norm = (status || "pending").toLowerCase();
  switch (norm) {
    case "confirmed":
      return { label: "Confirmed", icon: "👍", className: "status-pill status-confirmed" };
    case "preparing":
      return { label: "Preparing", icon: "👨‍🍳", className: "status-pill status-preparing" };
    case "out_for_delivery":
      return { label: "Out for Delivery", icon: "🛵", className: "status-pill status-out-for-delivery" };
    case "delivered":
      return { label: "Delivered", icon: "✅", className: "status-pill status-delivered" };
    case "cancelled":
      return { label: "Cancelled", icon: "❌", className: "status-pill status-cancelled" };
    case "pending":
    default:
      return { label: "Pending", icon: "⏳", className: "status-pill status-pending" };
  }
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("fz_token");
        if (!token) {
          throw new Error("Please login to view your orders.");
        }
        const data = await api("/orders/my-orders");
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Orders Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="container" style={{ padding: "50px 0" }}>
        <div className="orders-header">
          <h2>My Orders 📦</h2>
          <p className="muted">Fetching your order history...</p>
        </div>
        <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="order-card-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="container" style={{ padding: "50px 0" }}>
        <div className="empty-state-box">
          <h3>Unable to load orders</h3>
          <p className="muted">{error}</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: 12 }}>
            Sign In Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      {/* PAGE HEADER */}
      <div className="orders-page-header">
        <div>
          <h1 className="orders-main-heading">My Orders 📦</h1>
          <p className="muted">Track your live deliveries and past meal orders</p>
        </div>

        <Link to="/menu" className="btn btn-primary btn-order-more">
          <ShoppingBag size={16} />
          <span>Order More</span>
        </Link>
      </div>

      {/* NO ORDERS */}
      {orders.length === 0 ? (
        <div className="empty-state-box">
          <div className="empty-emoji">📦</div>
          <h3>No orders yet</h3>
          <p className="muted">
            You haven't placed any orders yet. Discover delicious dishes and enjoy superfast delivery!
          </p>
          <Link to="/menu" className="btn btn-primary" style={{ marginTop: 16 }}>
            Browse Delicious Menu
          </Link>
        </div>
      ) : (
        <div className="orders-list-grid">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            return (
              <div key={order._id} className="modern-order-card">
                {/* ORDER HEADER */}
                <div className="order-top-bar">
                  <div className="order-id-group">
                    <div className="order-icon-badge">
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="order-ref-number">Order #{order._id.slice(-6)}</h3>
                      <span className="order-date-text">
                        <Clock size={13} />
                        {new Date(order.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* HIGH-CONTRAST STATUS PILL (Pending / Confirmed / Delivered etc) */}
                  <div className={badge.className}>
                    <span className="status-pill-icon">{badge.icon}</span>
                    <span className="status-pill-text">{badge.label}</span>
                  </div>
                </div>

                {/* ITEMS SNAPSHOT */}
                <div className="order-items-preview">
                  {order.items.map((item, index) => (
                    <div key={`${order._id}-${index}`} className="order-item-row">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="order-item-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="order-item-info">
                        <span className="item-name-bold">{item.name}</span>
                        <span className="item-meta-tag">
                          Qty: {item.quantity} • Size: {item.size}
                          {item.addons?.length > 0 && ` • +${item.addons.join(", ")}`}
                        </span>
                      </div>
                      <div className="order-item-price">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ORDER BOTTOM STRIP */}
                <div className="order-bottom-strip">
                  <div className="order-meta-chips">
                    <span className="meta-chip-delivery">
                      <MapPin size={14} />
                      <span className="chip-address-text">{order.address}</span>
                    </span>

                    <span className="meta-chip-payment">
                      <CreditCard size={14} />
                      <span>{order.paymentMethod?.toUpperCase()} • {order.paymentStatus?.toUpperCase()}</span>
                    </span>
                  </div>

                  <div className="order-action-block">
                    <div className="order-total-preview">
                      <span className="total-label">Grand Total:</span>
                      <span className="total-value">₹{order.total}</span>
                    </div>

                    <Link to={`/orders/${order._id}`} className="btn-view-order-details">
                      <span>View Details</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}