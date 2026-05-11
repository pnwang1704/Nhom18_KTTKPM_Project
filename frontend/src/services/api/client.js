const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000';

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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