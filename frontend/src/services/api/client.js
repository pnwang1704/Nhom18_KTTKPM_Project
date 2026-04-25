const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000';

async function apiRequest(path, options = {}) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

export { apiBaseUrl, apiRequest };