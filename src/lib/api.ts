const API_URL = 'http://localhost:3001/api';

export const api = {
  // User APIs
  signup: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  // Product APIs
  getProducts: async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },

  // Order APIs
  createOrder: async (orderData: any) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  getOrders: async (userId: string) => {
    const response = await fetch(`${API_URL}/orders/${userId}`);
    return response.json();
  }
};
