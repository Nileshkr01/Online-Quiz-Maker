export const apiHost = "";

// Simple token storage
export function setToken(token){ localStorage.setItem("token", token); }
export function getToken(){ return localStorage.getItem("token"); }
export function clearToken(){ localStorage.removeItem("token"); }

export async function api(path, { method="GET", body, auth=false } = {}){
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`/api${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}
