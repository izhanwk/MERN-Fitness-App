export function unwrapApiData(payload) {
  if (payload && typeof payload === "object" && "data" in payload && "success" in payload) {
    return payload.data;
  }

  return payload;
}

export function getApiMessage(payload, fallback = "Request failed") {
  return (
    payload?.error?.message ||
    payload?.message ||
    fallback
  );
}
