import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/orders";

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

        const response = await fetch(
          `${API_URL}/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch order"
          );
        }

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
        style={{ padding: "40px 0" }}
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
        style={{ padding: "40px 0" }}
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

  return (
    <div
      className="container"
      style={{ padding: "30px 0" }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            Order #{order._id.slice(-6)}
          </h2>

          <p className="muted">
            {new Date(
              order.createdAt
            ).toLocaleString()}
          </p>
        </div>

        <Link
          to="/orders"
          className="btn btn-ghost"
        >
          ← Back to Orders
        </Link>
      </div>

      {/* STATUS */}
      <div
        className="summary"
        style={{
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div className="row">
          <span>Status</span>

          <strong
            style={{
              textTransform: "capitalize",
            }}
          >
            {order.status.replaceAll(
              "_",
              " "
            )}
          </strong>
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
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h3>Delivery Information</h3>

        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          <div>
            <strong>Address</strong>

            <p
              className="muted"
              style={{
                margin: "4px 0",
              }}
            >
              {order.address}
            </p>
          </div>

          {order.note && (
            <div>
              <strong>
                Order Note
              </strong>

              <p
                className="muted"
                style={{
                  margin: "4px 0",
                }}
              >
                {order.note}
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
