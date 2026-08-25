import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/orders/my-orders";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("fz_token");

        if (!token) {
          throw new Error(
            "Please login to view your orders."
          );
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

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

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        className="container"
        style={{ padding: "40px 0" }}
      >
        <h2>My Orders</h2>

        <p className="muted">
          Loading your orders...
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
        <h2>My Orders</h2>

        <div className="empty">
          <h3>Unable to load orders</h3>

          <p className="muted">
            {error}
          </p>

          <Link
            to="/login"
            className="btn btn-primary"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{ padding: "30px 0" }}
    >
      {/* PAGE HEADER */}
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
            My Orders
          </h2>

          <p className="muted">
            Your recent food orders
          </p>
        </div>

        <Link
          to="/menu"
          className="btn btn-primary"
        >
          Order More
        </Link>
      </div>

      {/* NO ORDERS */}
      {orders.length === 0 ? (
        <div className="empty">
          <div className="empty-ill" />

          <h3>No orders yet</h3>

          <p className="muted">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/menu"
            className="btn btn-primary"
            style={{ marginTop: 10 }}
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {orders.map((order) => (
            <div
              key={order._id}
              className="summary"
              style={{
                padding: 20,
              }}
            >
              {/* =========================
                  ORDER HEADER
              ========================= */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                    }}
                  >
                    Order #
                    {order._id.slice(-6)}
                  </h3>

                  <p
                    className="muted"
                    style={{
                      margin:
                        "5px 0 0",
                    }}
                  >
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <span
                  style={{
                    padding:
                      "6px 12px",
                    borderRadius: 20,
                    fontWeight: 600,
                    textTransform:
                      "capitalize",
                    background:
                      order.status ===
                      "delivered"
                        ? "#dcfce7"
                        : order.status ===
                          "cancelled"
                        ? "#fee2e2"
                        : "#fef3c7",
                  }}
                >
                  {order.status.replaceAll(
                    "_",
                    " "
                  )}
                </span>
              </div>

              {/* =========================
                  ORDER ITEMS
              ========================= */}
              <div
                style={{
                  display: "grid",
                  gap: 10,
                }}
              >
                {order.items.map(
                  (item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: 12,
                        padding: 10,
                        borderRadius: 10,
                        background:
                          "var(--surface-2)",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit:
                            "cover",
                          borderRadius: 8,
                        }}
                      />

                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <strong>
                          {item.name}
                        </strong>

                        <div className="muted">
                          Qty:{" "}
                          {item.quantity}
                          {" • "}
                          Size:{" "}
                          {item.size}
                        </div>

                        {item
                          .addons
                          ?.length >
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

              <hr />

              {/* =========================
                  ORDER SUMMARY
              ========================= */}
              <div
                style={{
                  display: "grid",
                  gap: 6,
                }}
              >
                <div className="row">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹{order.subtotal}
                  </span>
                </div>

                {order.discount >
                  0 && (
                  <div className="row">
                    <span>
                      Discount
                    </span>

                    <span>
                      -₹
                      {
                        order.discount
                      }
                    </span>
                  </div>
                )}

                <div className="row">
                  <span>
                    Delivery
                  </span>

                  <span>
                    ₹
                    {
                      order.deliveryFee
                    }
                  </span>
                </div>

                <div className="row">
                  <span>
                    Tax
                  </span>

                  <span>
                    ₹{order.tax}
                  </span>
                </div>

                <div className="row total">
                  <span>Total</span>

                  <span>
                    ₹{order.total}
                  </span>
                </div>

                <div className="row">
                  <span>
                    Payment
                  </span>

                  <span>
                    {order.paymentMethod?.toUpperCase()}
                  </span>
                </div>

                <div className="row">
                  <span>
                    Address
                  </span>

                  <span
                    style={{
                      textAlign:
                        "right",
                      maxWidth:
                        "60%",
                    }}
                  >
                    {order.address}
                  </span>
                </div>
              </div>

              {/* =========================
                  VIEW DETAILS
              ========================= */}
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  justifyContent:
                    "flex-end",
                }}
              >
                <Link
                  to={`/orders/${order._id}`}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}