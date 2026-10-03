import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import { getStatusBadge } from "./Orders";
import { CheckCircle2, ArrowLeft, Clock, MapPin, ShieldCheck } from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("fz_token");

        if (!token) {
          throw new Error("Please login to view this order.");
        }

        const data = await api(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        console.error("Order Details Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        className="container"
        style={{ padding: "60px 0", textAlign: "center" }}
      >
        <h2>Order Details</h2>
        <p className="muted">
          Loading order details...
        </p>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div
        className="container"
        style={{ padding: "60px 0" }}
      >
        <h2>Order Details</h2>

        <div className="empty">
          <h3>Unable to load order</h3>

          <p className="muted">
            {error}
          </p>

          <Link
            to="/orders"
            className="btn btn-primary"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const badge = getStatusBadge(order.status);

  return (
    <div
      className="container"
      style={{ padding: "30px 0", maxWidth: 840 }}
    >
      {/* ORDER SUCCESS CELEBRATION BANNER */}
      {order.status !== "cancelled" && (
        <div className="order-placed-banner">
          <div className="order-placed-icon-wrap">
            <CheckCircle2 size={32} />
          </div>
          <div className="order-placed-content">
            <h3 className="order-placed-title">Order Placed Successfully! 🎉</h3>
            <p className="order-placed-sub">
              Your order is recorded & confirmed. Our culinary team is preparing your delicious meal with utmost care!
            </p>
          </div>
          <div className="order-placed-badge">
            <ShieldCheck size={16} />
            <span>ID #{order._id.slice(-6).toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>
            Order Details #{order._id.slice(-6).toUpperCase()}
          </h2>

          <p className="muted" style={{ margin: "4px 0 0 0", display: "flex", alignItems: "center", gap: 6, fontSize: 13.5 }}>
            <Clock size={15} />
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <Link
          to="/orders"
          className="btn btn-ghost"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>
      </div>

      {/* STATUS */}
      <div
        className="summary"
        style={{
          padding: 24,
          marginBottom: 20,
          borderRadius: "var(--r-lg)",
        }}
      >
        <div className="row" style={{ alignItems: "center" }}>
          <span>Status</span>
          <div className={badge.className}>
            <span className="status-pill-icon">{badge.icon}</span>
            <span className="status-pill-text">{badge.label}</span>
          </div>
        </div>

        <div className="row">
          <span>Payment</span>

          <span>
            {order.paymentMethod?.toUpperCase()}
          </span>
        </div>

        <div className="row">
          <span>Payment Status</span>

          <span
            style={{
              textTransform: "capitalize",
            }}
          >
            {order.paymentStatus}
          </span>
        </div>

        <div style={{ marginTop: 18 }}>
          <strong>{order.status === "cancelled" ? "Order cancelled" : "Order tracking"}</strong>
          {order.status !== "cancelled" && <div className="tracking-steps">{["pending", "confirmed", "preparing", "out_for_delivery", "delivered"].map((step) => {
            const current = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"].indexOf(order.status);
            const index = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"].indexOf(step);
            const stamp = order.statusHistory?.find((entry) => entry.status === step)?.at;
            return <div key={step} className={index <= current ? "tracking-step done" : "tracking-step"}><span>●</span><span>{step.replaceAll("_", " ")}{stamp ? ` · ${new Date(stamp).toLocaleString()}` : ""}</span></div>;
          })}</div>}
        </div>
      </div>

      {/* ITEMS */}
      <div
        className="summary"
        style={{
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h3>Ordered Items</h3>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {order.items.map(
            (item, index) => (
              <div
                key={`${order._id}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 12,
                  borderRadius: 10,
                  background:
                    "var(--surface-2)",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 75,
                    height: 75,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />

                <div
                  style={{ flex: 1 }}
                >
                  <strong>
                    {item.name}
                  </strong>

                  <div className="muted">
                    Qty: {item.quantity}
                    {" • "}
                    Size: {item.size}
                  </div>

                  {item.addons?.length >
                    0 && (
                    <div className="muted">
                      Add-ons:{" "}
                      {item.addons.join(
                        ", "
                      )}
                    </div>
                  )}
                </div>

                <strong>
                  ₹
                  {item.price *
                    item.quantity}
                </strong>
              </div>
            )
          )}
        </div>
      </div>

      {/* PRICE SUMMARY */}
      <div
        className="summary"
        style={{
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h3>Price Summary</h3>

        <div className="row">
          <span>Subtotal</span>
          <span>
            ₹{order.subtotal}
          </span>
        </div>

        {order.discount > 0 && (
          <div className="row">
            <span>Discount</span>

            <span>
              -₹{order.discount}
            </span>
          </div>
        )}

        <div className="row">
          <span>Delivery</span>

          <span>
            ₹{order.deliveryFee}
          </span>
        </div>

        <div className="row">
          <span>Tax</span>

          <span>
            ₹{order.tax}
          </span>
        </div>

        <hr />

        <div className="row total">
          <span>Total</span>

          <span>
            ₹{order.total}
          </span>
        </div>
      </div>

      {/* DELIVERY INFORMATION */}
      <div
        className="summary"
        style={{
          padding: 24,
          marginBottom: 24,
          borderRadius: "var(--r-lg)",
        }}
      >
        <h3 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <MapPin size={20} color="var(--brand)" /> Delivery Information
        </h3>

        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <strong style={{ fontSize: 13.5, color: "var(--muted)" }}>Destination Address</strong>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text)",
              }}
            >
              {order.address}
            </p>
          </div>

          {order.note && (
            <div>
              <strong style={{ fontSize: 13.5, color: "var(--muted)" }}>Cooking / Delivery Instructions</strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 14.5,
                  fontStyle: "italic",
                  color: "var(--text)",
                }}
              >
                "{order.note}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* BACK BUTTON */}
      <div
        style={{
          textAlign: "center",
          marginTop: 20,
        }}
      >
        <Link
          to="/orders"
          className="btn btn-primary"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}
