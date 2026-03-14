import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  Link2,
  MousePointer,
  TrendingUp,
  ToggleLeft,
  Calendar,
  ExternalLink,
} from "lucide-react";

const StatCard = ({ icon, label, value, color }) => (
  <div
    style={{
      backgroundColor: "#1e293b",
      borderRadius: "12px",
      padding: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      borderLeft: `4px solid ${color}`,
    }}
  >
    <div style={{ color }}>{icon}</div>
    <div>
      <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.875rem" }}>
        {label}
      </p>
      <p
        style={{
          color: "white",
          margin: 0,
          fontSize: "1.75rem",
          fontWeight: "bold",
        }}
      >
        {value}
      </p>
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "2rem",
      }}
    >
      <h1 style={{ color: "white", marginBottom: "0.5rem" }}>Dashboard</h1>
      <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
        Overview of your shortened URLs
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          icon={<Link2 size={28} />}
          label="Total URLs"
          value={stats?.total_urls ?? 0}
          color="#6366f1"
        />
        <StatCard
          icon={<ToggleLeft size={28} />}
          label="Active URLs"
          value={stats?.active_urls ?? 0}
          color="#10b981"
        />
        <StatCard
          icon={<ToggleLeft size={28} />}
          label="Inactive URLs"
          value={stats?.inactive_urls ?? 0}
          color="#94a3b8"
        />
        <StatCard
          icon={<MousePointer size={28} />}
          label="Total Clicks"
          value={stats?.total_clicks ?? 0}
          color="#f59e0b"
        />
        <StatCard
          icon={<Calendar size={28} />}
          label="Clicks Today"
          value={stats?.clicks_today ?? 0}
          color="#3b82f6"
        />
        <StatCard
          icon={<TrendingUp size={28} />}
          label="Clicks This Month"
          value={stats?.clicks_this_month ?? 0}
          color="#ef4444"
        />
      </div>

      {stats?.top_urls?.length > 0 && (
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0, marginBottom: "1rem" }}>
            Top URLs
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#0f172a" }}>
                {["Title", "Short Code", "Clicks", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      color: "#94a3b8",
                      fontSize: "0.875rem",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.top_urls.map((url) => (
                <tr key={url.id} style={{ borderTop: "1px solid #334155" }}>
                  <td style={{ padding: "0.75rem 1rem", color: "white" }}>
                    {url.title || url.short_code}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6366f1" }}>
                    {url.short_code}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 1rem",
                      color: "#f59e0b",
                      fontWeight: "600",
                    }}
                  >
                    {url.total_clicks}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <button
                      onClick={() => navigate(`/urls/${url.id}/analytics`)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#6366f1",
                      }}
                    >
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
