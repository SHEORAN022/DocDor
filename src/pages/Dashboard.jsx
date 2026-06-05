// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

//   .db-root {
//     font-family: 'Sora', sans-serif;
//     background: #f4f6fa;
//     min-height: 100vh;
//     -webkit-font-smoothing: antialiased;
//     padding: 24px 32px;
//   }

//   /* ── WELCOME ── */
//   .db-welcome {
//     margin-bottom: 32px;
//     animation: fadeUp 0.4s ease;
//   }

//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(12px); }
//     to { opacity: 1; transform: translateY(0); }
//   }

//   .db-welcome-greeting {
//     font-size: 26px;
//     font-weight: 700;
//     color: #0f1623;
//     letter-spacing: -0.5px;
//   }

//   .db-welcome-sub {
//     font-size: 13px;
//     color: #94a3b8;
//     margin-top: 4px;
//   }

//   /* ── STATS GRID ── */
//   .db-stats {
//     display: grid;
//     grid-template-columns: repeat(4, 1fr);
//     gap: 16px;
//     margin-bottom: 28px;
//     animation: fadeUp 0.4s ease 0.05s both;
//   }

//   @media (max-width: 900px) { .db-stats { grid-template-columns: repeat(2, 1fr); } }
//   @media (max-width: 500px) { .db-stats { grid-template-columns: 1fr; } }

//   .db-stat-card {
//     background: #fff;
//     border: 1px solid #e8edf3;
//     border-radius: 14px;
//     padding: 20px;
//     transition: transform 0.15s, box-shadow 0.15s;
//   }

//   .db-stat-card:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 24px rgba(0,0,0,0.07);
//   }

//   .db-stat-icon {
//     width: 40px; height: 40px;
//     border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//     margin-bottom: 14px;
//     font-size: 18px;
//   }

//   .icon-blue { background: #eff4ff; }
//   .icon-green { background: #f0fdf4; }
//   .icon-purple { background: #faf5ff; }
//   .icon-amber { background: #fffbeb; }

//   .db-stat-label {
//     font-size: 11px;
//     font-weight: 600;
//     color: #94a3b8;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//     margin-bottom: 6px;
//   }

//   .db-stat-value {
//     font-size: 24px;
//     font-weight: 700;
//     color: #0f1623;
//     letter-spacing: -0.5px;
//   }

//   .db-stat-sub {
//     font-size: 11px;
//     color: #94a3b8;
//     margin-top: 4px;
//   }

//   /* ── GRID 2 ── */
//   .db-grid2 {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 20px;
//     margin-bottom: 20px;
//     animation: fadeUp 0.4s ease 0.1s both;
//   }

//   @media (max-width: 768px) { .db-grid2 { grid-template-columns: 1fr; } }

//   /* ── CARDS ── */
//   .db-card {
//     background: #fff;
//     border: 1px solid #e8edf3;
//     border-radius: 14px;
//     padding: 22px;
//   }

//   .db-card-title {
//     font-size: 14px;
//     font-weight: 700;
//     color: #0f1623;
//     margin-bottom: 4px;
//     letter-spacing: -0.2px;
//   }

//   .db-card-sub {
//     font-size: 11px;
//     color: #94a3b8;
//     margin-bottom: 18px;
//   }

//   /* ── PROFILE CARD ── */
//   .db-profile-header {
//     display: flex;
//     align-items: center;
//     gap: 14px;
//     padding: 16px;
//     background: linear-gradient(135deg, #eff4ff, #f0f7ff);
//     border-radius: 10px;
//     border: 1px solid #dbeafe;
//     margin-bottom: 16px;
//   }

//   .db-profile-avatar {
//     width: 52px; height: 52px;
//     border-radius: 50%;
//     background: linear-gradient(135deg, #2563eb, #60a5fa);
//     display: flex; align-items: center; justify-content: center;
//     font-size: 20px;
//     font-weight: 700;
//     color: white;
//     flex-shrink: 0;
//     box-shadow: 0 4px 12px rgba(37,99,235,0.25);
//   }

//   .db-profile-name { font-size: 16px; font-weight: 700; color: #0f1623; }
//   .db-profile-email { font-size: 12px; color: #64748b; margin-top: 2px; }

//   .db-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 4px;
//     margin-top: 5px;
//     background: #0f1623;
//     color: white;
//     font-size: 9px;
//     font-weight: 700;
//     letter-spacing: 0.8px;
//     text-transform: uppercase;
//     padding: 2px 8px;
//     border-radius: 20px;
//   }

//   .db-info-row {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 10px 0;
//     border-bottom: 1px solid #f1f5f9;
//     font-size: 13px;
//   }

//   .db-info-row:last-child { border-bottom: none; }
//   .db-info-label { color: #94a3b8; font-weight: 500; font-size: 12px; }
//   .db-info-value { color: #0f1623; font-weight: 600; }

//   .db-status-dot {
//     width: 7px; height: 7px;
//     border-radius: 50%;
//     background: #10b981;
//     display: inline-block;
//     margin-right: 5px;
//   }

//   /* ── ACTIVITY ── */
//   .db-activity-item {
//     display: flex;
//     align-items: flex-start;
//     gap: 12px;
//     padding: 10px 0;
//     border-bottom: 1px solid #f1f5f9;
//   }

//   .db-activity-item:last-child { border-bottom: none; }

//   .db-activity-dot {
//     width: 8px; height: 8px;
//     border-radius: 50%;
//     margin-top: 5px;
//     flex-shrink: 0;
//   }

//   .dot-blue { background: #2563eb; }
//   .dot-green { background: #10b981; }
//   .dot-amber { background: #f59e0b; }
//   .dot-purple { background: #8b5cf6; }

//   .db-activity-text { font-size: 13px; color: #334155; font-weight: 500; }
//   .db-activity-time { font-size: 11px; color: #94a3b8; margin-top: 2px; }

//   /* ── QUICK ACTIONS ── */
//   .db-actions {
//     display: grid;
//     grid-template-columns: repeat(3, 1fr);
//     gap: 10px;
//     animation: fadeUp 0.4s ease 0.15s both;
//   }

//   .db-action-btn {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 8px;
//     padding: 18px 12px;
//     background: #fff;
//     border: 1px solid #e8edf3;
//     border-radius: 12px;
//     cursor: pointer;
//     font-family: 'Sora', sans-serif;
//     transition: all 0.15s;
//     text-decoration: none;
//   }

//   .db-action-btn:hover {
//     background: #f8faff;
//     border-color: #bfdbfe;
//     transform: translateY(-1px);
//   }

//   .db-action-icon {
//     width: 40px; height: 40px;
//     border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 18px;
//   }

//   .db-action-label {
//     font-size: 12px;
//     font-weight: 600;
//     color: #334155;
//     text-align: center;
//   }
// `;

// function getInitials(name) {
//   if (!name) return 'A';
//   return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
// }

// export default function Dashboard() {
//   const { admin } = useAuth();
//   const navigate = useNavigate();
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const greeting = () => {
//     const h = currentTime.getHours();
//     if (h < 12) return 'Good morning';
//     if (h < 17) return 'Good afternoon';
//     return 'Good evening';
//   };

//   const activities = [
//     { dot: 'dot-green', text: 'Account created successfully', time: 'Today' },
//     { dot: 'dot-blue', text: 'Logged in to admin portal', time: 'Just now' },
//     { dot: 'dot-amber', text: 'JWT token generated', time: 'Just now' },
//     { dot: 'dot-purple', text: 'Session started', time: 'Just now' },
//   ];

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="db-root">
//         {/* WELCOME */}
//         <div className="db-welcome">
//           <div className="db-welcome-greeting">
//             {greeting()}, {admin?.name?.split(' ')[0] || 'Admin'} 👋
//           </div>
//           <div className="db-welcome-sub">
//             {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//           </div>
//         </div>

//         {/* STATS */}
//         <div className="db-stats">
//           <div className="db-stat-card">
//             <div className="db-stat-icon icon-blue">🛡️</div>
//             <div className="db-stat-label">Role</div>
//             <div className="db-stat-value" style={{ fontSize: '16px', marginTop: '2px' }}>{admin?.role || 'Admin'}</div>
//             <div className="db-stat-sub">Access level</div>
//           </div>
//           <div className="db-stat-card">
//             <div className="db-stat-icon icon-green">✅</div>
//             <div className="db-stat-label">Status</div>
//             <div className="db-stat-value" style={{ fontSize: '16px', color: '#10b981' }}>Active</div>
//             <div className="db-stat-sub">Account health</div>
//           </div>
//           <div className="db-stat-card">
//             <div className="db-stat-icon icon-purple">🔑</div>
//             <div className="db-stat-label">Session</div>
//             <div className="db-stat-value" style={{ fontSize: '16px' }}>7 Days</div>
//             <div className="db-stat-sub">Token validity</div>
//           </div>
//           <div className="db-stat-card">
//             <div className="db-stat-icon icon-amber">📅</div>
//             <div className="db-stat-label">Joined</div>
//             <div className="db-stat-value" style={{ fontSize: '13px', marginTop: '4px' }}>
//               {admin?.createdAt
//                 ? new Date(admin.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
//                 : 'Today'}
//             </div>
//             <div className="db-stat-sub">Member since</div>
//           </div>
//         </div>

//         {/* MAIN GRID */}
//         <div className="db-grid2">
//           {/* PROFILE CARD */}
//           <div className="db-card">
//             <div className="db-card-title">My Account</div>
//             <div className="db-card-sub">Your admin profile details</div>

//             <div className="db-profile-header">
//               <div className="db-profile-avatar">{getInitials(admin?.name)}</div>
//               <div>
//                 <div className="db-profile-name">{admin?.name || '—'}</div>
//                 <div className="db-profile-email">{admin?.email || '—'}</div>
//                 <div className="db-badge">🛡️ {admin?.role || 'Admin'}</div>
//               </div>
//             </div>

//             <div className="db-info-row">
//               <span className="db-info-label">Full Name</span>
//               <span className="db-info-value">{admin?.name || '—'}</span>
//             </div>
//             <div className="db-info-row">
//               <span className="db-info-label">Email</span>
//               <span className="db-info-value" style={{ fontSize: '12px' }}>{admin?.email || '—'}</span>
//             </div>
//             <div className="db-info-row">
//               <span className="db-info-label">Admin ID</span>
//               <span className="db-info-value" style={{ fontSize: '10px', fontFamily: 'monospace', color: '#64748b' }}>
//                 {admin?._id?.slice(0, 20) || '—'}...
//               </span>
//             </div>
//             <div className="db-info-row">
//               <span className="db-info-label">Account Status</span>
//               <span className="db-info-value">
//                 <span className="db-status-dot"></span>Active
//               </span>
//             </div>
//           </div>

//           {/* ACTIVITY */}
//           <div className="db-card">
//             <div className="db-card-title">Recent Activity</div>
//             <div className="db-card-sub">Latest events on your account</div>

//             {activities.map((a, i) => (
//               <div className="db-activity-item" key={i}>
//                 <div className={`db-activity-dot ${a.dot}`}></div>
//                 <div>
//                   <div className="db-activity-text">{a.text}</div>
//                   <div className="db-activity-time">{a.time}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* QUICK ACTIONS */}
//         <div style={{ marginBottom: '10px', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//           Quick Actions
//         </div>
//         <div className="db-actions">
//           <button className="db-action-btn" onClick={() => navigate('/profile')}>
//             <div className="db-action-icon" style={{ background: '#eff4ff' }}>👤</div>
//             <span className="db-action-label">Edit Profile</span>
//           </button>
//           <button className="db-action-btn" onClick={() => navigate('/admins')}>
//             <div className="db-action-icon" style={{ background: '#f0fdf4' }}>👥</div>
//             <span className="db-action-label">Manage Admins</span>
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  .db-root {
    font-family: 'Sora', sans-serif;
    background: #f4f6fa;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    padding: 24px 32px;
  }

  /* ── WELCOME ── */
  .db-welcome {
    margin-bottom: 32px;
    animation: fadeUp 0.4s ease;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .db-welcome-greeting {
    font-size: 26px;
    font-weight: 700;
    color: #0f1623;
    letter-spacing: -0.5px;
  }

  .db-welcome-sub {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 4px;
  }

  .logout-button {
    background: white;
    border: 1px solid #e2e8f0;
    padding: 10px 20px;
    border-radius: 12px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #ef4444;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logout-button:hover {
    background: #fef2f2;
    border-color: #fecaca;
    transform: translateY(-1px);
  }

  /* ── STATS GRID ── */
  .db-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
    animation: fadeUp 0.4s ease 0.05s both;
  }

  @media (max-width: 900px) { .db-stats { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 500px) { .db-stats { grid-template-columns: 1fr; } }

  .db-stat-card {
    background: #fff;
    border: 1px solid #e8edf3;
    border-radius: 14px;
    padding: 20px;
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .db-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.07);
  }

  .db-stat-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
    font-size: 18px;
  }

  .icon-blue { background: #eff4ff; }
  .icon-green { background: #f0fdf4; }
  .icon-purple { background: #faf5ff; }
  .icon-amber { background: #fffbeb; }

  .db-stat-label {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .db-stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #0f1623;
    letter-spacing: -0.5px;
  }

  .db-stat-sub {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 4px;
  }

  /* ── GRID 2 ── */
  .db-grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
    animation: fadeUp 0.4s ease 0.1s both;
  }

  @media (max-width: 768px) { .db-grid2 { grid-template-columns: 1fr; } }

  /* ── CARDS ── */
  .db-card {
    background: #fff;
    border: 1px solid #e8edf3;
    border-radius: 14px;
    padding: 22px;
  }

  .db-card-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f1623;
    margin-bottom: 4px;
    letter-spacing: -0.2px;
  }

  .db-card-sub {
    font-size: 11px;
    color: #94a3b8;
    margin-bottom: 18px;
  }

  /* ── PROFILE CARD ── */
  .db-profile-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    background: linear-gradient(135deg, #eff4ff, #f0f7ff);
    border-radius: 10px;
    border: 1px solid #dbeafe;
    margin-bottom: 16px;
  }

  .db-profile-avatar {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(37,99,235,0.25);
  }

  .db-profile-name { font-size: 16px; font-weight: 700; color: #0f1623; }
  .db-profile-email { font-size: 12px; color: #64748b; margin-top: 2px; }

  .db-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 5px;
    background: #0f1623;
    color: white;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 20px;
  }

  .db-info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 13px;
  }

  .db-info-row:last-child { border-bottom: none; }
  .db-info-label { color: #94a3b8; font-weight: 500; font-size: 12px; }
  .db-info-value { color: #0f1623; font-weight: 600; }

  .db-status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #10b981;
    display: inline-block;
    margin-right: 5px;
  }

  /* ── ACTIVITY ── */
  .db-activity-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .db-activity-item:last-child { border-bottom: none; }

  .db-activity-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
  }

  .dot-blue { background: #2563eb; }
  .dot-green { background: #10b981; }
  .dot-amber { background: #f59e0b; }
  .dot-purple { background: #8b5cf6; }

  .db-activity-text { font-size: 13px; color: #334155; font-weight: 500; }
  .db-activity-time { font-size: 11px; color: #94a3b8; margin-top: 2px; }

  /* ── QUICK ACTIONS ── */
  .db-actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    animation: fadeUp 0.4s ease 0.15s both;
  }

  .db-action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 18px 12px;
    background: #fff;
    border: 1px solid #e8edf3;
    border-radius: 12px;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    transition: all 0.15s;
    text-decoration: none;
  }

  .db-action-btn:hover {
    background: #f8faff;
    border-color: #bfdbfe;
    transform: translateY(-1px);
  }

  .db-action-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  .db-action-label {
    font-size: 12px;
    font-weight: 600;
    color: #334155;
    text-align: center;
  }
`;

function getInitials(name) {
  if (!name) return 'A';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const h = currentTime.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const activities = [
    { dot: 'dot-green', text: 'Account created successfully', time: 'Today' },
    { dot: 'dot-blue', text: 'Logged in to admin portal', time: 'Just now' },
    { dot: 'dot-amber', text: 'JWT token generated', time: 'Just now' },
    { dot: 'dot-purple', text: 'Session started', time: 'Just now' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="db-root">
        {/* WELCOME with Logout Button */}
        <div className="db-welcome">
          <div>
            <div className="db-welcome-greeting">
              {greeting()}, {admin?.name?.split(' ')[0] || 'Admin'} 👋
            </div>
            <div className="db-welcome-sub">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* STATS */}
        <div className="db-stats">
          <div className="db-stat-card">
            <div className="db-stat-icon icon-blue">🛡️</div>
            <div className="db-stat-label">Role</div>
            <div className="db-stat-value" style={{ fontSize: '16px', marginTop: '2px' }}>{admin?.role || 'Admin'}</div>
            <div className="db-stat-sub">Access level</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-icon icon-green">✅</div>
            <div className="db-stat-label">Status</div>
            <div className="db-stat-value" style={{ fontSize: '16px', color: '#10b981' }}>Active</div>
            <div className="db-stat-sub">Account health</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-icon icon-purple">🔑</div>
            <div className="db-stat-label">Session</div>
            <div className="db-stat-value" style={{ fontSize: '16px' }}>7 Days</div>
            <div className="db-stat-sub">Token validity</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-icon icon-amber">📅</div>
            <div className="db-stat-label">Joined</div>
            <div className="db-stat-value" style={{ fontSize: '13px', marginTop: '4px' }}>
              {admin?.createdAt
                ? new Date(admin.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'Today'}
            </div>
            <div className="db-stat-sub">Member since</div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="db-grid2">
          {/* PROFILE CARD */}
          <div className="db-card">
            <div className="db-card-title">My Account</div>
            <div className="db-card-sub">Your admin profile details</div>

            <div className="db-profile-header">
              <div className="db-profile-avatar">{getInitials(admin?.name)}</div>
              <div>
                <div className="db-profile-name">{admin?.name || '—'}</div>
                <div className="db-profile-email">{admin?.email || '—'}</div>
                <div className="db-badge">🛡️ {admin?.role || 'Admin'}</div>
              </div>
            </div>

            <div className="db-info-row">
              <span className="db-info-label">Full Name</span>
              <span className="db-info-value">{admin?.name || '—'}</span>
            </div>
            <div className="db-info-row">
              <span className="db-info-label">Email</span>
              <span className="db-info-value" style={{ fontSize: '12px' }}>{admin?.email || '—'}</span>
            </div>
            <div className="db-info-row">
              <span className="db-info-label">Admin ID</span>
              <span className="db-info-value" style={{ fontSize: '10px', fontFamily: 'monospace', color: '#64748b' }}>
                {admin?._id?.slice(0, 20) || '—'}...
              </span>
            </div>
            <div className="db-info-row">
              <span className="db-info-label">Account Status</span>
              <span className="db-info-value">
                <span className="db-status-dot"></span>Active
              </span>
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="db-card">
            <div className="db-card-title">Recent Activity</div>
            <div className="db-card-sub">Latest events on your account</div>

            {activities.map((a, i) => (
              <div className="db-activity-item" key={i}>
                <div className={`db-activity-dot ${a.dot}`}></div>
                <div>
                  <div className="db-activity-text">{a.text}</div>
                  <div className="db-activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ marginBottom: '10px', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Quick Actions
        </div>
        <div className="db-actions">
          <button className="db-action-btn" onClick={() => navigate('/profile')}>
            <div className="db-action-icon" style={{ background: '#eff4ff' }}>👤</div>
            <span className="db-action-label">Edit Profile</span>
          </button>
          <button className="db-action-btn" onClick={() => navigate('/admins')}>
            <div className="db-action-icon" style={{ background: '#f0fdf4' }}>👥</div>
            <span className="db-action-label">Manage Admins</span>
          </button>
          <button className="db-action-btn" onClick={handleLogout}>
            <div className="db-action-icon" style={{ background: '#fef2f2' }}>🚪</div>
            <span className="db-action-label">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}