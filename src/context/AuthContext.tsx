import { createContext, useContext, createSignal, onMount, JSX } from "solid-js";
import { apiFetch, getStoredToken, setStoredToken, DEBUG } from "~/lib/api";


type AuthContextType = {
  user: () => string | null;
  token: () => string | null;
  signup: (username: string, password: string) => Promise<any>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>();

// store username of loggen in ...
export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<string | null>(null);
  const [token, setToken] = createSignal<string | null>(null);

  onMount(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = getStoredToken();

    // Only restore if both exist and are non-empty strings
    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    } else {
      // Clear any leftover session (prevents unwanted auto-login)
      localStorage.removeItem("user");
      setStoredToken(null);
    }
  });


  // Signup
  const signup = async (username: string, password: string) => {
    if (DEBUG) console.debug("Auth.signup: calling /register", { username });
    const { res, body } = await apiFetch("/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      // apiFetch sets Content-Type and credentials by default
    });
    if (DEBUG) console.debug("Auth.signup: response", { status: res.status, body });
    return body;
  };

  // Login
  const login = async (username: string, password: string) => {
    if (DEBUG) console.debug("Auth.login: calling /login", { username });
    const { res, body } = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (DEBUG) console.debug("Auth.login: response", { status: res.status, body, headers: Array.from(res.headers.entries()) });

    // Token .... check token
    const headerAuth = res.headers.get("authorization") || res.headers.get("Authorization");
    let authToken: string | null = null;
    if (headerAuth) authToken = headerAuth.startsWith("Bearer ") ? headerAuth.slice(7) : headerAuth;
    authToken = authToken || body?.token || body?.access_token || body?.Authorization || null;

    if (!authToken) {
      // Login must return a token for this app's JWT flow.
      // Treat missing token as a failed login so unregistered creds cannot succeed.
      const msg = body?.message || "Login failed: no token returned";
      throw new Error(msg);
    }

    setUser(username);
    setToken(authToken);
    localStorage.setItem("user", username);
    setStoredToken(authToken);
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    setStoredToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
