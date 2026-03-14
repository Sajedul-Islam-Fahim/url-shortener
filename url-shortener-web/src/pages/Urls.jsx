import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  BarChart2,
  Copy,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #334155",
  backgroundColor: "#0f172a",
  color: "white",
  boxSizing: "border-box",
};

const labelStyle = {
  color: "#94a3b8",
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.875rem",
};

function UrlForm({ onSuccess, editUrl = null }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    original_url: editUrl?.original_url || "",
    short_code: editUrl?.short_code || "",
    title: editUrl?.title || "",
    expires_at: editUrl?.expires_at || "",
    is_active: editUrl?.is_active ?? true,
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.short_code) delete payload.short_code;
      if (!payload.expires_at) delete payload.expires_at;

      if (editUrl) {
        await api.put(`/urls/${editUrl.id}`, payload);
        toast.success("URL updated successfully");
      } else {
        await api.post("/urls", payload);
        toast.success("URL shortened successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Original URL *</label>
        <input
          type="url"
          name="original_url"
          value={form.original_url}
          onChange={handleChange}
          required
          placeholder="https://example.com/long-url"
          style={inputStyle}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <label style={labelStyle}>Custom Short Code (optional)</label>
          <input
            type="text"
            name="short_code"
            value={form.short_code}
            onChange={handleChange}
            placeholder="my-link"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Title (optional)</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="My Link"
            style={inputStyle}
          />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <label style={labelStyle}>Expires At (optional)</label>
          <input
            type="datetime-local"
            name="expires_at"
            value={form.expires_at}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            paddingTop: "1.5rem",
          }}
        >
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            id="is_active"
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <label
            htmlFor="is_active"
            style={{ ...labelStyle, margin: 0, cursor: "pointer" }}
          >
            Active
          </label>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "1rem",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Saving..." : editUrl ? "Update URL" : "Shorten URL"}
      </button>
    </form>
  );
}

export default function Urls() {
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUrl, setEditUrl] = useState(null);
  const [filters, setFilters] = useState({ search: "", is_active: "" });

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.is_active) params.is_active = filters.is_active;
      const res = await api.get("/urls", { params });
      setUrls(res.data);
    } catch (error) {
      toast.error("Failed to load URLs");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this URL?")) return;
    try {
      await api.delete(`/urls/${id}`);
      toast.success("URL deleted successfully");
      fetchUrls();
    } catch (error) {
      toast.error("Failed to delete URL");
    }
  };

  const handleToggleActive = async (url) => {
    try {
      await api.put(`/urls/${url.id}`, { is_active: !url.is_active });
      toast.success(`URL ${!url.is_active ? "activated" : "deactivated"}`);
      fetchUrls();
    } catch (error) {
      toast.error("Failed to update URL");
    }
  };

  const handleCopy = (shortCode) => {
    const shortUrl = `${import.meta.env.VITE_BASE_URL}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Short URL copied to clipboard");
  };

  const handleEdit = (url) => {
    setEditUrl(url);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditUrl(null);
    fetchUrls();
  };

  const selectStyle = {
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "white",
    cursor: "pointer",
    fontSize: "0.875rem",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h1 style={{ color: "white", margin: 0 }}>My URLs</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditUrl(null);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Close" : "Shorten URL"}
        </button>
      </div>

      <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
        {urls.length} URL{urls.length !== 1 ? "s" : ""} found
      </p>

      {showForm && (
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0, marginBottom: "1.5rem" }}>
            {editUrl ? "Edit URL" : "Shorten New URL"}
          </h2>
          <UrlForm onSuccess={handleFormSuccess} editUrl={editUrl} />
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search URLs..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ ...selectStyle, minWidth: "220px" }}
        />
        <select
          value={filters.is_active}
          onChange={(e) =>
            setFilters({ ...filters, is_active: e.target.value })
          }
          style={selectStyle}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button
          onClick={() => setFilters({ search: "", is_active: "" })}
          style={{ ...selectStyle, color: "#94a3b8" }}
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#94a3b8", textAlign: "center" }}>Loading URLs...</p>
      ) : urls.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>No URLs found.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {urls.map((url) => (
            <div
              key={url.id}
              style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                padding: "1.25rem",
                borderLeft: `4px solid ${url.is_active ? "#10b981" : "#475569"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "white", margin: "0 0 0.25rem" }}>
                    {url.title || url.short_code}
                  </h3>
                  <p
                    style={{
                      color: "#6366f1",
                      margin: "0 0 0.25rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {import.meta.env.VITE_BASE_URL}/{url.short_code}
                  </p>
                  <p
                    style={{
                      color: "#94a3b8",
                      margin: 0,
                      fontSize: "0.8rem",
                      wordBreak: "break-all",
                    }}
                  >
                    {url.original_url.length > 80
                      ? url.original_url.substring(0, 80) + "..."
                      : url.original_url}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      color: "#f59e0b",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    {url.total_clicks} clicks
                  </span>
                  <span
                    style={{
                      backgroundColor: url.is_active
                        ? "#10b98122"
                        : "#47556922",
                      color: url.is_active ? "#10b981" : "#94a3b8",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {url.is_active ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => handleCopy(url.short_code)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6366f1",
                    }}
                    title="Copy short URL"
                  >
                    <Copy size={16} />
                  </button>
                  <a
                    href={url.original_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#94a3b8" }}
                    title="Open original URL"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => navigate(`/urls/${url.id}/analytics`)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#3b82f6",
                    }}
                    title="Analytics"
                  >
                    <BarChart2 size={16} />
                  </button>
                  <button
                    onClick={() => handleToggleActive(url)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: url.is_active ? "#10b981" : "#475569",
                    }}
                    title="Toggle active"
                  >
                    {url.is_active ? (
                      <ToggleRight size={20} />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(url)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6366f1",
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(url.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {url.expires_at && (
                <p
                  style={{
                    color: "#94a3b8",
                    margin: "0.75rem 0 0",
                    fontSize: "0.8rem",
                  }}
                >
                  Expires: {new Date(url.expires_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
