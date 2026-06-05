import { useState, useEffect } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "https://userside-x164.onrender.com/api";

const INIT_FORM = {
  title: "",
  shortDescription: "",
  description: "",
  category: "",
  checkupType: "",
  actualPrice: "",
  salePrice: "",
  reportTime: "24-48 Hours",
  totalTests: 0,
  recommended: false,
  bestSeller: false,
  homeSample: true,
  digitalReport: true,
  nablCertified: true,
  image: null,
  guidelines: [],
  parameters: [],
};

export default function LabTests() {
  const [list, setList]             = useState([]);
  const [categories, setCategories] = useState([]);
  const [checkupTypes, setCheckupTypes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(INIT_FORM);
  const [preview, setPreview]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [filterRec, setFilterRec]   = useState("");
  const [filterBS, setFilterBS]     = useState("");

  // guideline / parameter inputs
  const [guideInput, setGuideInput]   = useState("");
  const [paramTitle, setParamTitle]   = useState("");
  const [paramDesc, setParamDesc]     = useState("");

  // ── FETCH ──────────────────────────────────────────────────────────────────

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [testsRes, catsRes, chksRes] = await Promise.all([
        axios.get(`${BASE}/lab-tests`),
        axios.get(`${BASE}/labCategories`),
        axios.get(`${BASE}/checkup-types`),
      ]);
      setList(testsRes.data.data || []);
      setCategories(catsRes.data.data || []);
      setCheckupTypes(chksRes.data.data || []);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── OPEN MODAL ─────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditItem(null);
    setForm(INIT_FORM);
    setPreview(null);
    setGuideInput("");
    setParamTitle(""); setParamDesc("");
    setError("");
    setModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title:            item.title,
      shortDescription: item.shortDescription || "",
      description:      item.description || "",
      category:         item.category?._id || item.category || "",
      checkupType:      item.checkupType?._id || item.checkupType || "",
      actualPrice:      item.actualPrice,
      salePrice:        item.salePrice,
      reportTime:       item.reportTime,
      totalTests:       item.totalTests,
      recommended:      item.recommended,
      bestSeller:       item.bestSeller,
      homeSample:       item.homeSample,
      digitalReport:    item.digitalReport,
      nablCertified:    item.nablCertified,
      image:            null,
      guidelines:       item.guidelines || [],
      parameters:       item.parameters || [],
    });
    setPreview(item.image?.url || null);
    setGuideInput("");
    setParamTitle(""); setParamDesc("");
    setError("");
    setModal(true);
  };

  const closeModal = () => { setModal(false); setError(""); };

  // ── FIELD HELPERS ──────────────────────────────────────────────────────────

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleBool = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));

  const onImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setField("image", file);
    setPreview(URL.createObjectURL(file));
  };

  // ── GUIDELINES ─────────────────────────────────────────────────────────────

  const addGuideline = () => {
    const text = guideInput.trim();
    if (!text) return;
    setForm((f) => ({ ...f, guidelines: [...f.guidelines, { text }] }));
    setGuideInput("");
  };

  const removeGuideline = (i) =>
    setForm((f) => ({ ...f, guidelines: f.guidelines.filter((_, idx) => idx !== i) }));

  // ── PARAMETERS ─────────────────────────────────────────────────────────────

  const addParameter = () => {
    const title = paramTitle.trim();
    if (!title) return;
    setForm((f) => ({ ...f, parameters: [...f.parameters, { title, description: paramDesc.trim() }] }));
    setParamTitle(""); setParamDesc("");
  };

  const removeParameter = (i) =>
    setForm((f) => ({ ...f, parameters: f.parameters.filter((_, idx) => idx !== i) }));

  // ── SAVE ───────────────────────────────────────────────────────────────────

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim())    return setError("Title is required");
    if (!form.category)        return setError("Category is required");
    if (!form.checkupType)     return setError("Checkup Type is required");
    if (!form.actualPrice)     return setError("Actual Price is required");
    if (!form.salePrice)       return setError("Sale Price is required");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",            form.title.trim());
      fd.append("shortDescription", form.shortDescription);
      fd.append("description",      form.description);
      fd.append("category",         form.category);
      fd.append("checkupType",      form.checkupType);
      fd.append("actualPrice",      form.actualPrice);
      fd.append("salePrice",        form.salePrice);
      fd.append("reportTime",       form.reportTime);
      fd.append("totalTests",       form.totalTests);
      fd.append("recommended",      form.recommended);
      fd.append("bestSeller",       form.bestSeller);
      fd.append("homeSample",       form.homeSample);
      fd.append("digitalReport",    form.digitalReport);
      fd.append("nablCertified",    form.nablCertified);
      fd.append("guidelines",       JSON.stringify(form.guidelines));
      fd.append("parameters",       JSON.stringify(form.parameters));
      if (form.image) fd.append("image", form.image);

      if (editItem) {
        await axios.put(`${BASE}/lab-tests/${editItem._id}`, fd);
      } else {
        await axios.post(`${BASE}/lab-tests`, fd);
      }

      closeModal();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ── DELETE ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lab test?")) return;
    try {
      await axios.delete(`${BASE}/lab-tests/${id}`);
      fetchAll();
    } catch {
      alert("Delete failed");
    }
  };

  // ── FILTER ─────────────────────────────────────────────────────────────────

  const filtered = list.filter((t) => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const matchRec    = !filterRec || String(t.recommended) === filterRec;
    const matchBS     = !filterBS  || String(t.bestSeller)  === filterBS;
    return matchSearch && matchRec && matchBS;
  });

  // ── CHIP ───────────────────────────────────────────────────────────────────

  const Chip = ({ field, label }) => (
    <button
      type="button"
      onClick={() => toggleBool(field)}
      style={{
        ...styles.chip,
        ...(form[field] ? styles.chipOn : {}),
      }}
    >
      {label}
    </button>
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div style={styles.page}>

      {/* ── Header ── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Lab Tests</h1>
          <p style={styles.pageSub}>{list.length} total tests</p>
        </div>
        <button style={styles.btnPrimary} onClick={openAdd}>+ Add Test</button>
      </div>

      {/* ── Filters ── */}
      <div style={styles.toolbar}>
        <input
          style={styles.searchInput}
          placeholder="Search tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={styles.select} value={filterRec} onChange={(e) => setFilterRec(e.target.value)}>
          <option value="">All</option>
          <option value="true">Recommended</option>
          <option value="false">Not Recommended</option>
        </select>
        <select style={styles.select} value={filterBS} onChange={(e) => setFilterBS(e.target.value)}>
          <option value="">All</option>
          <option value="true">Best Seller</option>
          <option value="false">Not Best Seller</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div style={styles.tableWrap}>
        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.center}>No lab tests found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {["Test", "Category", "Price", "Report", "Badges", "Features", "Actions"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id} style={styles.tr}>
                  {/* Test */}
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {item.image?.url
                        ? <img src={item.image.url} alt={item.title} style={styles.thumb} />
                        : <div style={styles.thumbPlaceholder}>🧪</div>
                      }
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{item.title}</div>
                        {item.shortDescription && (
                          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{item.shortDescription}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={styles.td}>
                    <span style={styles.badgeBlue}>
                      {item.category?.name || "—"}
                    </span>
                  </td>

                  {/* Price */}
                  <td style={styles.td}>
                    <div style={{ textDecoration: "line-through", color: "#aaa", fontSize: 12 }}>
                      ₹{item.actualPrice}
                    </div>
                    <div style={{ fontWeight: 600, color: "#0f6e56" }}>₹{item.salePrice}</div>
                  </td>

                  {/* Report */}
                  <td style={{ ...styles.td, fontSize: 12, color: "#666" }}>
                    {item.reportTime}
                    <div style={{ fontSize: 11, color: "#aaa" }}>{item.totalTests} tests</div>
                  </td>

                  {/* Badges */}
                  <td style={styles.td}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {item.recommended && <span style={styles.badgeAmber}>⭐ Recommended</span>}
                      {item.bestSeller  && <span style={styles.badgeRed}>🔥 Best Seller</span>}
                      {!item.recommended && !item.bestSeller && <span style={{ color: "#ccc", fontSize: 12 }}>—</span>}
                    </div>
                  </td>

                  {/* Features */}
                  <td style={styles.td}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {item.homeSample    && <span style={styles.badgeGreen}>🏠 Home</span>}
                      {item.digitalReport && <span style={styles.badgeBlue}>📄 Digital</span>}
                      {item.nablCertified && <span style={styles.badgeAmber}>✅ NABL</span>}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button style={styles.btnEdit}   onClick={() => openEdit(item)}>Edit</button>
                      <button style={styles.btnDelete} onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={styles.modal}>
            <div style={styles.modalHead}>
              <h2 style={styles.modalTitle}>{editItem ? "Edit Lab Test" : "Add Lab Test"}</h2>
              <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSave} style={styles.modalBody}>
              {error && <div style={styles.errorBox}>{error}</div>}

              {/* ── Basic Info ── */}
              <div style={styles.sectionLabel}>Basic Info</div>
              <div style={styles.grid2}>
                <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
                  <label style={styles.label}>Title *</label>
                  <input style={styles.input} value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g., Complete Blood Count" />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
                  <label style={styles.label}>Short Description</label>
                  <input style={styles.input} value={form.shortDescription} onChange={(e) => setField("shortDescription", e.target.value)} placeholder="Brief summary..." />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
                  <label style={styles.label}>Full Description</label>
                  <textarea style={styles.textarea} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Detailed information..." />
                </div>
              </div>

              {/* ── Category & Type ── */}
              <div style={styles.sectionLabel}>Classification</div>
              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category *</label>
                  <select style={styles.input} value={form.category} onChange={(e) => setField("category", e.target.value)}>
                    <option value="">Select category...</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Checkup Type *</label>
                  <select style={styles.input} value={form.checkupType} onChange={(e) => setField("checkupType", e.target.value)}>
                    <option value="">Select type...</option>
                    {checkupTypes.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
              </div>

              {/* ── Pricing ── */}
              <div style={styles.sectionLabel}>Pricing & Details</div>
              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Actual Price (₹) *</label>
                  <input style={styles.input} type="number" value={form.actualPrice} onChange={(e) => setField("actualPrice", e.target.value)} placeholder="1200" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Sale Price (₹) *</label>
                  <input style={styles.input} type="number" value={form.salePrice} onChange={(e) => setField("salePrice", e.target.value)} placeholder="799" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Report Time</label>
                  <input style={styles.input} value={form.reportTime} onChange={(e) => setField("reportTime", e.target.value)} placeholder="24-48 Hours" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Total Tests Included</label>
                  <input style={styles.input} type="number" value={form.totalTests} onChange={(e) => setField("totalTests", e.target.value)} />
                </div>
              </div>

              {/* ── Image ── */}
              <div style={styles.sectionLabel}>Image</div>
              <div style={styles.formGroup}>
                {preview && <img src={preview} alt="preview" style={styles.preview} />}
                <label style={styles.uploadBtn}>
                  {form.image ? "Change Image" : preview ? "Replace Image" : "Upload Image"}
                  <input type="file" accept="image/*" onChange={onImage} style={{ display: "none" }} />
                </label>
                {form.image && <span style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{form.image.name}</span>}
              </div>

              {/* ── Flags ── */}
              <div style={styles.sectionLabel}>Badges & Features</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                <Chip field="recommended"   label="⭐ Recommended" />
                <Chip field="bestSeller"    label="🔥 Best Seller" />
                <Chip field="homeSample"    label="🏠 Home Sample" />
                <Chip field="digitalReport" label="📄 Digital Report" />
                <Chip field="nablCertified" label="✅ NABL Certified" />
              </div>

              {/* ── Guidelines ── */}
              <div style={styles.sectionLabel}>Guidelines</div>
              <div style={{ marginBottom: 16 }}>
                {form.guidelines.map((g, i) => (
                  <div key={i} style={styles.tagRow}>
                    <span style={{ fontSize: 13 }}>• {g.text}</span>
                    <button type="button" style={styles.removeBtn} onClick={() => removeGuideline(i)}>✕</button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    style={{ ...styles.input, flex: 1 }}
                    value={guideInput}
                    onChange={(e) => setGuideInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGuideline())}
                    placeholder="Type guideline and press Enter or Add"
                  />
                  <button type="button" style={styles.btnSecondary} onClick={addGuideline}>Add</button>
                </div>
              </div>

              {/* ── Parameters ── */}
              <div style={styles.sectionLabel}>Parameters</div>
              <div style={{ marginBottom: 20 }}>
                {form.parameters.map((p, i) => (
                  <div key={i} style={styles.tagRow}>
                    <div>
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{p.title}</span>
                      {p.description && <span style={{ color: "#888", fontSize: 12, marginLeft: 6 }}>— {p.description}</span>}
                    </div>
                    <button type="button" style={styles.removeBtn} onClick={() => removeParameter(i)}>✕</button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input
                    style={{ ...styles.input, flex: "1 1 140px" }}
                    value={paramTitle}
                    onChange={(e) => setParamTitle(e.target.value)}
                    placeholder="Parameter title *"
                  />
                  <input
                    style={{ ...styles.input, flex: "2 1 200px" }}
                    value={paramDesc}
                    onChange={(e) => setParamDesc(e.target.value)}
                    placeholder="Description (optional)"
                  />
                  <button type="button" style={styles.btnSecondary} onClick={addParameter}>Add</button>
                </div>
              </div>

              <div style={styles.modalFoot}>
                <button type="button" style={styles.btnSecondary} onClick={closeModal}>Cancel</button>
                <button type="submit" style={styles.btnPrimary} disabled={saving}>
                  {saving ? "Saving..." : editItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────

const styles = {
  page:             { padding: "24px", fontFamily: "'DM Sans', sans-serif", color: "#1a1a18" },
  header:           { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  pageTitle:        { fontSize: 22, fontWeight: 600, margin: 0 },
  pageSub:          { fontSize: 13, color: "#888", marginTop: 4 },
  toolbar:          { marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap" },
  searchInput:      { padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, width: 220, outline: "none", fontFamily: "inherit" },
  select:           { padding: "8px 10px", border: "1px solid #ddd", borderRadius: 8, fontSize: 12, background: "#fff", fontFamily: "inherit", outline: "none", cursor: "pointer" },
  tableWrap:        { background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" },
  table:            { width: "100%", borderCollapse: "collapse" },
  th:               { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#888", background: "#fafaf8", borderBottom: "1px solid #eee" },
  tr:               { borderBottom: "1px solid #f0f0ee" },
  td:               { padding: "12px 16px", fontSize: 14, verticalAlign: "middle" },
  thumb:            { width: 40, height: 40, borderRadius: 8, objectFit: "cover", border: "1px solid #eee" },
  thumbPlaceholder: { width: 40, height: 40, borderRadius: 8, background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
  actions:          { display: "flex", gap: 8 },
  center:           { padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 },
  badgeBlue:        { background: "#e8eeff", color: "#1a5cff", padding: "3px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" },
  badgeGreen:       { background: "#e1f5ee", color: "#0f6e56", padding: "3px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" },
  badgeAmber:       { background: "#faeeda", color: "#854f0b", padding: "3px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" },
  badgeRed:         { background: "#fcebeb", color: "#a32d2d", padding: "3px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" },
  btnPrimary:       { padding: "9px 16px", background: "#1a5cff", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnSecondary:     { padding: "9px 14px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnEdit:          { padding: "6px 12px", background: "#e8eeff", color: "#1a5cff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" },
  btnDelete:        { padding: "6px 12px", background: "#fcebeb", color: "#a32d2d", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" },
  overlay:          { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal:            { background: "#fff", borderRadius: 14, width: 580, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  modalHead:        { padding: "18px 22px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 1 },
  modalTitle:       { fontSize: 16, fontWeight: 600, margin: 0 },
  closeBtn:         { background: "#f5f5f0", border: "none", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 13, flexShrink: 0 },
  modalBody:        { padding: "20px 22px" },
  modalFoot:        { display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: "1px solid #eee" },
  sectionLabel:     { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a5cff", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #e8eeff" },
  grid2:            { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 },
  formGroup:        { display: "flex", flexDirection: "column", gap: 5 },
  label:            { fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" },
  input:            { padding: "9px 11px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit", outline: "none", background: "#fff" },
  textarea:         { padding: "9px 11px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit", outline: "none", minHeight: 80, resize: "vertical" },
  uploadBtn:        { display: "inline-block", padding: "8px 14px", background: "#f5f5f0", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 500, width: "fit-content" },
  preview:          { width: 80, height: 80, borderRadius: 10, objectFit: "cover", border: "1px solid #eee", marginBottom: 8 },
  errorBox:         { background: "#fcebeb", color: "#a32d2d", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 },
  chip:             { padding: "6px 12px", border: "1px solid #ddd", borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "#fff", color: "#666", fontFamily: "inherit" },
  chipOn:           { background: "#e8eeff", color: "#1a5cff", borderColor: "#1a5cff" },
  tagRow:           { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "#fafaf8", borderRadius: 6, marginBottom: 6 },
  removeBtn:        { background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 13, padding: "0 4px" },
};