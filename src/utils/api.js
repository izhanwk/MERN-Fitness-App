export default function apiFetch(url, options = {}) {
  const { headers = {}, ...rest } = options;
  return fetch(url, {
    ...rest,
    headers: {
      "ngrok-skip-browser-warning": "true",
      ...headers,
    },
  });
}
