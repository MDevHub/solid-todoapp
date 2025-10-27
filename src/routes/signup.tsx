import { createSignal } from "solid-js";
import { useAuth } from "~/context/AuthContext";
import { useNavigate } from "@solidjs/router";
import { Eye, EyeOff } from "lucide-solid"; 

export default function SignUp() {
  const { signup, login } = useAuth();
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
  e.preventDefault();
  setError("");

  // custom validation before making any API request
  if (password().length < 6 || password().length > 20) {
    setError("Password must be between 6 and 20 characters.");
    return; // stop submission
  }

  setLoading(true);

  try {
    const data = await signup(username(), password());
    try {
      await login(username(), password());
      navigate("/dashboard");
    } catch (loginErr: any) {
      setError(loginErr?.message || "Signup succeeded but auto-login failed. Please sign in.");
      navigate("/signin");
    }
  } catch (err: any) {
    setError(err?.message || "Registration failed. Please try again.");
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
          Create an Account
        </h2>

        {error() && (
          <p class="text-red-500 text-sm mb-3 text-center">{error()}</p>
        )}

        <div class="mb-3">
          <input
            id="username"
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
            id="password"
            type={showPassword() ? "text" : "password"}
            placeholder="Password (min 6 characters)"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            minlength="6"
            maxlength="20"
            class="w-full p-2 border border-(--border) rounded-md focus:outline-none focus:ring-2 focus:ring-(--navbg)"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword())}
            class="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword() ? <Eye size={18} /> : <EyeOff size={18} /> }
          </button>
        </div>

        <button
          type="submit"
          disabled={loading()}
          class="w-full bg-(--bgd) cursor-pointer text-white py-3 rounded-lg hover:bg-transparent hover:border hover:border-(--border) hover:text-(--dark-text) transition duration-300"
        >
          {loading() ? "Creating Account..." : "Sign Up"}
        </button>

        <p class="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/signin" class="text-(--navbg) hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
