import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "https://userside-x164.onrender.com/api/admin";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    min-height: 100vh;
    display: flex;
    font-family: 'Sora', sans-serif;
    background: #f4f6fa;
    -webkit-font-smoothing: antialiased;
  }

  .auth-left {
    width: 44%;
    background: #0f1623;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 52px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .auth-left::before {
    content: '';
    position: absolute;
    top: -120px; left: -120px;
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .auth-left::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .left-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 1;
  }

  .logo-box {
    width: 40px; height: 40px;
    background: #2563eb;
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
  }

  .logo-name { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.4px; }
  .logo-tag { font-size: 10px; color: #64748b; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; }

  .left-hero { position: relative; z-index: 1; }

  .left-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #3b82f6;
    margin-bottom: 16px;
  }

  .left-title {
    font-size: 36px;
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    letter-spacing: -1px;
    margin-bottom: 16px;
  }

  .left-title span { color: #3b82f6; }
  .left-desc { font-size: 14px; color: #64748b; line-height: 1.7; max-width: 300px; }

  .left-stats {
    display: flex;
    gap: 28px;
    position: relative;
    z-index: 1;
  }

  .stat-num { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
  .stat-lbl { font-size: 11px; color: #64748b; margin-top: 2px; font-weight: 500; }

  .auth-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
    animation: slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-header { margin-bottom: 32px; }
  .card-title { font-size: 26px; font-weight: 700; color: #0f1623; letter-spacing: -0.6px; }
  .card-sub { font-size: 13px; color: #94a3b8; margin-top: 6px; }

  .tab-row {
    display: flex;
    background: #f1f5f9;
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 28px;
  }

  .tab-btn {
    flex: 1;
    padding: 9px;
    border: none;
    background: transparent;
    border-radius: 7px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: #fff;
    color: #0f1623;
    box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  }

  .form-group { margin-bottom: 16px; }

  .form-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 7px;
    letter-spacing: 0.2px;
  }

  .form-group input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 9px;
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    color: #0f1623;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .form-group input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
  }

  .form-group input::placeholder { color: #cbd5e1; }

  .btn-submit {
    width: 100%;
    padding: 13px;
    background: #0f1623;
    color: #fff;
    border: none;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.15s, transform 0.1s;
    margin-top: 6px;
  }

  .btn-submit:hover { background: #1e293b; }
  .btn-submit:active { transform: scale(0.99); }
  .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  .alert {
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

  .spin {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .auth-footer {
    margin-top: 24px;
    text-align: center;
    font-size: 12px;
    color: #94a3b8;
  }

  .link-btn {
    background: none;
    border: none;
    color: #2563eb;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    padding: 0;
  }

  .link-btn:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .auth-left { display: none; }
    .auth-right { padding: 32px 20px; }
  }
`;

export default function Register() {
  const navigate = useNavigate();
const { login, register } = useAuth();

  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const showAlert = (msg, type = "error") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const switchTab = (t) => {
    setTab(t);
    setAlert(null);
  };

  // const handleLogin = async () => {
  //   if (!loginEmail || !loginPassword) {
  //     showAlert("Please fill in all fields");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`${API}/login`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: loginEmail, password: loginPassword }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok || !data.success) {
  //       showAlert(data.message || "Login failed");
  //     } else {
  //       localStorage.setItem("adminToken", data.token);
  //       localStorage.setItem("adminInfo", JSON.stringify(data.admin));
  //       showAlert("Login successful! Redirecting...", "success");
  //       setTimeout(() => {
  //         navigate("/dashboard");
  //       }, 1000);
  //     }
  //   } catch {
  //     showAlert("Cannot connect to server. Is the API running?");
  //   }
  //   setLoading(false);
  // };
const handleLogin = async () => {
  if (!loginEmail || !loginPassword) {
    showAlert("Please fill in all fields");
    return;
  }

  setLoading(true);

  const success = await login(loginEmail, loginPassword);

  if (success) {
    navigate("/dashboard");
  }

  setLoading(false);
};
  // const handleRegister = async () => {
  //   if (!regName || !regEmail || !regPassword) {
  //     showAlert("All fields are required");
  //     return;
  //   }
  //   if (regPassword.length < 6) {
  //     showAlert("Password must be at least 6 characters");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`${API}/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok || !data.success) {
  //       showAlert(data.message || "Registration failed");
  //     } else {
  //       localStorage.setItem("adminToken", data.token);
  //       localStorage.setItem("adminInfo", JSON.stringify(data.admin));
  //       showAlert("Account created! Redirecting...", "success");
  //       setTimeout(() => {
  //         navigate("/dashboard");
  //       }, 1000);
  //     }
  //   } catch {
  //     showAlert("Cannot connect to server. Is the API running?");
  //   }
  //   setLoading(false);
  // };
const handleRegister = async () => {
  if (!regName || !regEmail || !regPassword) {
    showAlert("All fields are required");
    return;
  }

  if (regPassword.length < 6) {
    showAlert("Password must be at least 6 characters");
    return;
  }

  setLoading(true);

  const success = await register(regName, regEmail, regPassword);

  if (success) {
    navigate("/dashboard");
  }

  setLoading(false);
};
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      tab === "login" ? handleLogin() : handleRegister();
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-left">
          <div className="left-logo">
            <div className="logo-box">
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div className="logo-name">MediAdmin</div>
              <div className="logo-tag">Management Portal</div>
            </div>
          </div>

          <div className="left-hero">
            <div className="left-eyebrow">Admin Portal</div>
            <div className="left-title">
              Manage your<br />clinic <span>smarter</span><br />& faster.
            </div>
            <div className="left-desc">
              A centralized dashboard for doctors, appointments, and patient management — all in one place.
            </div>
          </div>

          <div className="left-stats">
            <div className="stat"><div className="stat-num">99%</div><div className="stat-lbl">Uptime</div></div>
            <div className="stat"><div className="stat-num">256-bit</div><div className="stat-lbl">Encryption</div></div>
            <div className="stat"><div className="stat-num">24/7</div><div className="stat-lbl">Support</div></div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card" key={tab}>
            <div className="card-header">
              <div className="card-title">{tab === "login" ? "Welcome back 👋" : "Create account ✨"}</div>
              <div className="card-sub">
                {tab === "login" ? "Sign in to your admin account to continue" : "Register a new admin account to get started"}
              </div>
            </div>

            <div className="tab-row">
              <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => switchTab("login")}>Sign In</button>
              <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => switchTab("register")}>Register</button>
            </div>

            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

            {tab === "login" && (
              <div onKeyDown={handleKeyDown}>
                <div className="form-group"><label>Email Address</label><input type="email" placeholder="admin@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} /></div>
                <div className="form-group"><label>Password</label><input type="password" placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} /></div>
                <button className="btn-submit" onClick={handleLogin} disabled={loading}>{loading ? <span className="spin" /> : null}{loading ? "Signing in..." : "Sign In"}</button>
              </div>
            )}

            {tab === "register" && (
              <div onKeyDown={handleKeyDown}>
                <div className="form-group"><label>Full Name</label><input type="text" placeholder="John Doe" value={regName} onChange={(e) => setRegName(e.target.value)} /></div>
                <div className="form-group"><label>Email Address</label><input type="email" placeholder="admin@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} /></div>
                <div className="form-group"><label>Password</label><input type="password" placeholder="Min. 6 characters" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} /></div>
                <button className="btn-submit" onClick={handleRegister} disabled={loading}>{loading ? <span className="spin" /> : null}{loading ? "Creating account..." : "Create Account"}</button>
              </div>
            )}

            <div className="auth-footer">
              {tab === "login" ? (
                <>Don't have an account? <button className="link-btn" onClick={() => switchTab("register")}>Register here</button></>
              ) : (
                <>Already have an account? <button className="link-btn" onClick={() => switchTab("login")}>Sign in</button></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}