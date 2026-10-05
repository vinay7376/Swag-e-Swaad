import React, { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "../components/Toast";

export default function Admin() {
  const { push } = useToast();
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [foodForm, setFoodForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    isVeg: true,
  });

  const load = useCallback(async () => {
    try {
      setError("");
      let result;
      if (tab === "dashboard") {
        result = (await api("/admin/dashboard")).dashboard;
      } else if (tab === "orders") {
        result = (await api("/orders/admin/all")).orders;
      } else if (tab === "foods") {
        result = (await api("/foods")).foods;
      } else if (tab === "users") {
        result = (await api("/admin/users")).users;
      }

      if (tab !== "dashboard" && !Array.isArray(result)) {
        throw new Error(`Could not load ${tab}: the server returned unexpected data.`);
      }
      setData(result);
    } catch (e) {
      setData(null);
      setError(e.message);
    }
  }, [tab]);

  useEffect(() => {
    setData(null);
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    try {
      await api(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      push({ message: "Status updated", variant: "success" });
      load();
    } catch (e) {
      push({ message: e.message, variant: "error" });
    }
  };

  const createFood = async (event) => {
    event.preventDefault();
    try {
      await api("/foods", {
        method: "POST",
        body: JSON.stringify({ ...foodForm, price: Number(foodForm.price) }),
      });
      setFoodForm({
        name: "",
        category: "",
        price: "",
        description: "",
        isVeg: true,
      });
      push({ message: "Food added", variant: "success" });
      load();
    } catch (e) {
      push({ message: e.message, variant: "error" });
    }
  };

  const removeFood = async (id) => {
    if (!window.confirm("Remove this food item?")) return;
    try {
      await api(`/foods/${id}`, { method: "DELETE" });
      push({ message: "Food deleted", variant: "success" });
      load();
    } catch (e) {
      push({ message: e.message, variant: "error" });
    }
  };

  return (
    <div className="container" style={{ padding: "30px 0" }}>
      <h2>Admin dashboard</h2>
      <div className="filters">
        {["dashboard", "orders", "foods", "users"].map((name) => (
          <button
            key={name}
            className={`btn ${tab === name ? "btn-primary" : "btn-ghost"}`}
            onClick={() => {
              setData(null);
              setTab(name);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      {error && (
        <div className="empty">
          <p>{error}</p>
        </div>
      )}
      {tab === "dashboard" && data && !Array.isArray(data) && (
        <div className="menu-grid">
          {Object.entries(data)
            .filter(([key]) => key !== "recentOrders")
            .map(([key, value]) => (
              <div className="summary" key={key}>
                <strong>{key.replace(/([A-Z])/g, " $1")}</strong>
                <h2>{key === "totalRevenue" ? `₹${value}` : value}</h2>
              </div>
            ))}
        </div>
      )}
      {tab === "orders" && (
        <div className="cart-list">
          {Array.isArray(data) &&
            data.map((order) => (
              <div className="summary" key={order._id}>
                <strong>
                  #{order._id.slice(-6)} · {order.user?.name}
                </strong>
                <p>
                  {order.status} · {order.paymentStatus} · ₹{order.total}
                </p>
                <select
                  value={order.status}
                  onChange={(e) => setStatus(order._id, e.target.value)}
                >
                  <option value={order.status}>{order.status}</option>
                  {[
                    "confirmed",
                    "preparing",
                    "out_for_delivery",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
      )}
      {tab === "foods" && (
        <>
          <form className="summary auth-form" onSubmit={createFood}>
            <h3>Add food</h3>
            <input
              className="input"
              required
              placeholder="Name"
              value={foodForm.name}
              onChange={(e) =>
                setFoodForm({ ...foodForm, name: e.target.value })
              }
            />
            <input
              className="input"
              required
              placeholder="Category"
              value={foodForm.category}
              onChange={(e) =>
                setFoodForm({ ...foodForm, category: e.target.value })
              }
            />
            <input
              className="input"
              required
              min="0"
              type="number"
              placeholder="Price"
              value={foodForm.price}
              onChange={(e) =>
                setFoodForm({ ...foodForm, price: e.target.value })
              }
            />
            <textarea
              className="textarea"
              placeholder="Description"
              value={foodForm.description}
              onChange={(e) =>
                setFoodForm({ ...foodForm, description: e.target.value })
              }
            />
            <label className="checkbox">
              <input
                type="checkbox"
                checked={foodForm.isVeg}
                onChange={(e) =>
                  setFoodForm({ ...foodForm, isVeg: e.target.checked })
                }
              />
              Vegetarian
            </label>
            <button className="btn btn-primary">Add food</button>
          </form>
          <div className="menu-grid">
            {Array.isArray(data) &&
              data.map((food) => (
                <div className="summary" key={food._id}>
                  <strong>{food.name}</strong>
                  <p>
                    ₹{food.price} · {food.category}
                  </p>
                  <p>{food.isAvailable ? "Available" : "Unavailable"}</p>
                  <button
                    className="btn btn-ghost"
                    onClick={() => removeFood(food._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </>
      )}
      {tab === "users" && (
        <div className="cart-list">
          {Array.isArray(data) &&
            data.map((member) => (
              <div className="summary" key={member._id}>
                <strong>{member.name}</strong>
                <p>
                  {member.email} · {member.role} · {member.orderCount} orders
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
