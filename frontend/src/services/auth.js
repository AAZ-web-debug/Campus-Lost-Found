const API_URL = 'http://localhost:5000/api';

export const register = async (userId, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, password })
  });
  return response.json();
};

export const login = async (userId, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      // ✅ store token
      localStorage.setItem('token', data.token);

      // ✅ store userId manually (since backend doesn't send it)
      localStorage.setItem('userId', userId);

      return data;
    } else {
      return { error: data.error || 'Login failed' };
    }
  } catch (err) {
    return { error: 'Server error' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

export const getToken = () => localStorage.getItem('token');
export const getUserId = () => localStorage.getItem('userId');
export const isAuthenticated = () => !!getToken();