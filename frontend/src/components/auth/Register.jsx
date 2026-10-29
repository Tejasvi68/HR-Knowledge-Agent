import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

function Register() {
const navigate = useNavigate();
const { register } = useAuth();

const [form, setForm] = useState({
name: "",
email: "",
password: "",
confirmPassword: "",
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


if (form.name.trim().length < 2) {
  setError("Please enter your full name.");
  return;
}

if (form.password.length < 8) {
  setError("Password must contain at least 8 characters.");
  return;
}

if (form.password.length > 72) {
  setError("Password must not exceed 72 characters.");
  return;
}

if (form.password !== form.confirmPassword) {
  setError("Passwords do not match.");
  return;
}

setLoading(true);

try {
  await register({
    name: form.name.trim(),
    email: form.email.trim(),
    password: form.password,
  });

  navigate("/", { replace: true });
} catch (err) {
  setError(err.message || "Unable to create your account.");
} finally {
  setLoading(false);
}


}

return ( <main className="auth-page"> <section className="auth-card"> <div className="auth-brand-icon"> <ShieldCheck size={25} /> </div>


    <h1>Create your account</h1>
    <p className="auth-subtitle">
      Register to access your company's HR policies.
    </p>

    {error && (
      <div className="auth-error" role="alert">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="register-name">Full name</label>
        <input
          id="register-name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-email">Email address</label>
        <input
          id="register-email"
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
        <label htmlFor="register-password">Password</label>

        <div className="password-field">
          <input
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
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

      <div className="form-group">
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
      </div>

      <button
        type="submit"
        className="primary-button auth-submit"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>

    <p className="auth-switch">
      Already have an account? <Link to="/login">Sign in</Link>
    </p>
  </section>
</main>


);
}

export default Register;
