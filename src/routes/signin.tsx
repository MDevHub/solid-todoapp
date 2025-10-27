import { createSignal } from "solid-js";
import { useAuth } from "~/context/AuthContext";
import { useNavigate } from "@solidjs/router";
import { Eye, EyeOff } from "lucide-solid";

export default function SignIn() {
  const { login } = useAuth();
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username(), password());
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        class="border border-(--border) bg-white p-6 rounded-lg w-full sm:w-[400px]"
      >
        <h2 class="text-xl md:text-2xl font-semibold text-center mb-4 text-gray-800">
          Welcome Back
        </h2>

        {error() && (
          <p class="text-red-500 text-sm mb-3 text-center">{error()}</p>
        )}

        <div class="mb-3">
          <input
            type="text"
            placeholder="Username"
            value={username()}
            onInput={(e) => setUsername(e.currentTarget.value)}
            class="w-full p-2 border border-(--border) rounded-md focus:outline-none focus:ring-1 focus:ring-(--navbg)"
            required
          />
        </div>

        <div class="relative mb-4">
          <input
            type={showPassword() ? "text" : "password"}
            placeholder="Password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            class="w-full p-2 border border-(--border) rounded-md focus:outline-none focus:ring-2 focus:ring-(--navbg)"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword())}
            class="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword() ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading()}
          class="w-full bg-(--bgd) cursor-pointer text-white py-3 rounded-lg hover:bg-transparent hover:border hover:border-(--border) hover:text-(--dark-text) transition duration-300"
        >
          {loading() ? "Signing In..." : "Login"}
        </button>

        <p class="text-center text-sm mt-4 text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" class="text-(--navbg) hover:underline">
            Create one
          </a>
        </p>
      </form>
    </div>
  );
}
