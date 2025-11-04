const API_BASE_URL = (import.meta.env?.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      const data = await response.json();
      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchAvailability(date) {
  const query = new URLSearchParams({ date });
  return request(`/availability?${query.toString()}`);
}

export function createReservation(payload) {
  return request('/reservations', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
