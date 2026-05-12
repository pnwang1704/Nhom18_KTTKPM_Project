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

    if (response.status === 401) {
      handleUnauthorized();
    }

    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

async function apiUpload(path, formData) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData
    });

    if (response.status === 401) {
      handleUnauthorized();
    }

    return response;
  } catch (error) {
    console.error('API Upload Error:', error);
    throw error;
  }
}

function handleUnauthorized() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
}

export { apiBaseUrl, apiRequest, apiUpload };