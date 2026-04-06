const API_BASE =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000/api";

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    // Backend responded but with error status
    if (!response.ok) {
      const error = new Error(payload?.error || "Request failed");
      error.response = {
        status: response.status,
        data: payload,
      };
      throw error;
    }

    return payload;
  } catch (error) {
    // ✅ Better network error handling
    if (error.name === "TypeError") {
      throw new Error(
        "Unable to connect to backend server. Please make sure backend is running on port 5000."
      );
    }

    throw error;
  }
}

export const api = {
  get: async (path) => {
    return await request(path);
  },

  post: async (path, body) => {
    return await request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put: async (path, body) => {
    return await request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete: async (path) => {
    return await request(path, {
      method: "DELETE",
    });
  },
};