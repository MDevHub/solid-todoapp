const API_BASE = import.meta.env.VITE_API_BASE || "https://todo.basecliff.com";
const DEBUG = Boolean((import.meta as any).env?.VITE_DEBUG) || Boolean((import.meta as any).env?.DEV);

function fullUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

// storing and retrieving the JWT token the API returns when a user logs in.
export function getStoredToken(): string | null {
  return localStorage.getItem("token");
}

export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

async function parseJsonIfPossible(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  return null;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = fullUrl(path);

  const token = getStoredToken();
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  if (DEBUG) {
    console.debug("apiFetch -> request", { url, init: { ...init, headers: Object.fromEntries(headers.entries()) } });
  }

  const res = await fetch(url, { ...init, headers, credentials: (init.credentials as RequestCredentials) || "include" });
  const body = await parseJsonIfPossible(res);

  if (DEBUG) {
    // log a compact response summary
    const h: Record<string,string> = {};
    res.headers.forEach((v,k)=> (h[k]=v));
    console.debug("apiFetch <- response", { url, status: res.status, headers: h, body });
  }

  if (!res.ok) {
    const msg = body?.message || body?.error || res.statusText || `Request failed: ${res.status}`;
    const err: any = new Error(msg);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return { res, body } as { res: Response; body: any };
}

export { API_BASE, DEBUG };
