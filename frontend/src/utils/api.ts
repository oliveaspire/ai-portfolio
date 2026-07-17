export async function apiFetch(url: string, options: RequestInit = {}) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  let token = localStorage.getItem("admin_token");
  
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  
  let res = await fetch(`${backendUrl}${url}`, { ...options, headers });
  
  if (res.status === 401) {
    const refreshToken = localStorage.getItem("admin_refresh_token");
    if (refreshToken) {
      const refreshRes = await fetch(`${backendUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem("admin_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("admin_refresh_token", data.refresh_token);
        }
        
        headers.set("Authorization", `Bearer ${data.access_token}`);
        res = await fetch(`${backendUrl}${url}`, { ...options, headers });
      } else {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_refresh_token");
        window.location.href = "/login";
      }
    } else {
      localStorage.removeItem("admin_token");
      window.location.href = "/login";
    }
  }
  return res;
}
