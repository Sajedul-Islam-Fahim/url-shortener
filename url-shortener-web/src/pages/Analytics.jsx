import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { ArrowLeft, MousePointer } from "lucide-react";

const BarChart = ({ data, label }) => {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        borderRadius: "12px",
        padding: "1.5rem",
      }}
    >
      <h3 style={{ color: "white", marginTop: 0, marginBottom: "1rem" }}>
        {label}
      </h3>
      {data.length === 0 ? (
        <p style={{ color: "#475569" }}>No data available</p>
      ) : (
        data.map((item) => (
          <div
            key={item[Object.keys(item)[0]]}
            style={{ marginBottom: "0.75rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.25rem",
              }}
            >
              <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                {item[Object.keys(item)[0]] || "Unknown"}
              </span>
              <span
                style={{
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                }}
              >
                {item.count}
              </span>
            </div>
            <div
              style={{
                backgroundColor: "#0f172a",
                borderRadius: "999px",
                height: "6px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#6366f1",
                  borderRadius: "999px",
                  height: "6px",
                  width: `${(item.count / max) * 100}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/urls/${id}/analytics`)
      .then((res) => setData(res.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
        Loading...
      </div>
    );
  if (!data) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "2rem",
      }}
    >
      <button
        onClick={() => navigate("/urls")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          fontSize: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <ArrowLeft size={18} /> Back to URLs
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ color: "white", margin: 0 }}>
            {data.url?.title || data.url?.short_code}
          </h1>
          <p
            style={{
              color: "#6366f1",
              margin: "0.25rem 0 0",
              fontSize: "0.875rem",
            }}
          >
            {import.meta.env.VITE_BASE_URL}/{data.url?.short_code}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <MousePointer size={24} color="#f59e0b" />
          <div>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.875rem" }}>
              Total Clicks
            </p>
            <p
              style={{
                color: "white",
                margin: 0,
                fontSize: "1.75rem",
                fontWeight: "bold",
              }}
            >
              {data.total_clicks}
            </p>
          </div>
        </div>
      </div>

      {data.clicks_by_date?.length > 0 && (
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ color: "white", marginTop: 0, marginBottom: "1rem" }}>
            Clicks Over Time
          </h3>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "flex-end",
              height: "120px",
              overflowX: "auto",
            }}
          >
            {data.clicks_by_date.map((d) => {
              const max = Math.max(
                ...data.clicks_by_date.map((x) => x.count),
                1,
              );
              return (
                <div
                  key={d.date}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                    minWidth: "40px",
                  }}
                >
                  <span style={{ color: "#94a3b8", fontSize: "0.7rem" }}>
                    {d.count}
                  </span>
                  <div
                    style={{
                      backgroundColor: "#6366f1",
                      borderRadius: "4px 4px 0 0",
                      width: "32px",
                      height: `${(d.count / max) * 80}px`,
                      minHeight: "4px",
                    }}
                  />
                  <span
                    style={{
                      color: "#475569",
                      fontSize: "0.65rem",
                      transform: "rotate(-45deg)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(d.date).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        <BarChart data={data.by_browser} label="By Browser" />
        <BarChart data={data.by_os} label="By OS" />
        <BarChart data={data.by_device} label="By Device" />
        <BarChart data={data.by_referrer} label="Top Referrers" />
        <BarChart data={data.by_country} label="By Country" />
      </div>
    </div>
  );
}
