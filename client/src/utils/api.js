// src/utils/api.js
export const getAccessToken = () => {
  // Replace with your actual token-getter (context/localStorage)
  return localStorage.getItem('accessToken');
};

const base = import.meta.env.VITE_API_BASE || '/api';

export async function apiGet(path) {
  const res = await fetch(base + path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken() || ''}`,
    },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(base + path, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken() || ''}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(base + path, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken() || ''}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(base + path, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${getAccessToken() || ''}`,
    },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
