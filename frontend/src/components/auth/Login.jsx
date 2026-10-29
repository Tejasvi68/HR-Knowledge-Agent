import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

function Login() {
const navigate = useNavigate();
const { login } = useAuth();

const [form, setForm] = useState({
email: "",
password: "",
});

const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

function handleChange(event) {
setForm({
...form,
[event.target.name]: event.target.value,
});
}

async function handleSubmit(event) {
event.preventDefault();
setError("");
setLoading(true);


try {
  await login({
    email: form.email.trim(),
    password: form.password,
  });

  navigate("/", { replace: true });
} catch (err) {
  setError(err.message || "Unable to log in. Please try again.");
} finally {
  setLoading(false);
}


}

return ( <main className="auth-page"> <section className="auth-card"> <div className="auth-brand-icon"> <ShieldCheck size={25} /> </div>


    <h1>Welcome back</h1>
    <p className="auth-subtitle">
      Sign in to access your HR Knowledge Agent.
    </p>

    {error && (
      <div className="auth-error" role="alert">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          name="email"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>

        <div className="password-field">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="primary-button auth-submit"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>

    <p className="auth-switch">
      Don't have an account? <Link to="/register">Create account</Link>
    </p>
  </section>
</main>


);
}

export default Login;
