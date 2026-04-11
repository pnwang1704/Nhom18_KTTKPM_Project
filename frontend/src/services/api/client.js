const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  return response;
}

export { apiBaseUrl, apiRequest };