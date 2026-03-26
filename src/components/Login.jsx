import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "600px", marginTop: "100px", marginBottom: "100px" }}
    >
      <div
        style={{
          padding: "60px",
          border: "1px solid var(--text-ink)",
          backgroundColor: "white",
          boxShadow: "15px 15px 0px var(--silver-accent)",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 className="h-large" style={{ margin: 0, letterSpacing: "1px" }}>
            SIGN IN
          </h1>
          <p
            style={{
              fontFamily: "var(--font-main)",
              color: "#666",
              fontSize: "13px",
              marginTop: "10px",
            }}
          >
            Access your subscriber account to continue reading.
          </p>
        </header>

        {error && (
          <div
            style={{
              backgroundColor: "#fff5f5",
              color: "#d32f2f",
              padding: "12px",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              marginBottom: "30px",
              border: "1px solid #feb2b2",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="editor-field">
            <label className="editor-label">Email Address</label>
            <input
              className="editor-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@provider.com"
            />
          </div>

          <div className="editor-field" style={{ marginBottom: "40px" }}>
            <label className="editor-label">Password</label>
            <input
              className="editor-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "11px",
                  color: "#666",
                  textDecoration: "underline",
                }}
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-heritage"
            style={{ width: "100%", marginBottom: "20px" }}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <div
          style={{
            position: "relative",
            textAlign: "center",
            margin: "30px 0",
          }}
        >
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--silver-accent)",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              padding: "0 15px",
              color: "#666",
              fontSize: "11px",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
            }}
          >
            OR
          </span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn-heritage"
          style={{
            width: "100%",
            backgroundColor: "white",
            color: "var(--text-ink)",
            border: "1px solid var(--text-ink)",
            marginBottom: "30px",
          }}
        >
          <span style={{ marginRight: "10px" }}>G</span> CONTINUE WITH GOOGLE
        </button>

        <footer
          style={{
            textAlign: "center",
            paddingTop: "30px",
            borderTop: "1px solid var(--silver-accent)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              color: "#666",
              fontWeight: 600,
            }}
          >
            NOT A SUBSCRIBER?{" "}
            <Link
              to="/signup"
              style={{ color: "var(--text-ink)", textDecoration: "underline" }}
            >
              JOIN THE GAZETTE TODAY
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
