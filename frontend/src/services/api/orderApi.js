import { apiRequest } from "./client";

export const orderApi = {
  checkout: async (items) => {
    if (!items || items.length === 0) {
      throw new Error("Cart is empty");
    }

    try {
      const response = await apiRequest("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ items }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || result?.error || "Checkout failed");
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  getOrder: async (id) => {
    try {
      const response = await apiRequest(`/api/orders/${id}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || result?.error || "Get order failed");
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
  listOrders: async () => {
    try {
      const response = await apiRequest(`/api/orders`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "List orders failed",
        );
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
  getMyOrders: async () => {
    try {
      const response = await apiRequest(`/api/orders/me`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Get my orders failed",
        );
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
};
