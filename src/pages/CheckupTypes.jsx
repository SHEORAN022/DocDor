// import { useState, useEffect } from "react";
// import axios from "axios";

// const BASE = import.meta.env.VITE_API_URL || "https://userside-x164.onrender.com/api";

// const INIT = { title: "", slug: "", image: null };

// export default function CheckupTypes() {
//   const [list, setList]       = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modal, setModal]     = useState(false);
//   const [form, setForm]       = useState(INIT);
//   const [preview, setPreview] = useState(null);
//   const [saving, setSaving]   = useState(false);
//   const [error, setError]     = useState("");
//   const [search, setSearch]   = useState("");

//   // ── FETCH ──────────────────────────────────────────────────────────────────

//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`${BASE}/checkup-types`);
//       setList(data.data || []);
//     } catch {
//       setError("Failed to load checkup types");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchAll(); }, []);

//   // ── SLUG AUTO-GENERATE ─────────────────────────────────────────────────────

//   const onTitleChange = (val) => {
//     const slug = val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
//     setForm((f) => ({ ...f, title: val, slug }));
//   };

//   // ── IMAGE ──────────────────────────────────────────────────────────────────

//   const onImage = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setForm((f) => ({ ...f, image: file }));
//     setPreview(URL.createObjectURL(file));
//   };

//   // ── OPEN / CLOSE ───────────────────────────────────────────────────────────

//   const openAdd = () => {
//     setForm(INIT);
//     setPreview(null);
//     setError("");
//     setModal(true);
//   };

//   const closeModal = () => { setModal(false); setError(""); };

//   // ── SAVE ───────────────────────────────────────────────────────────────────

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.title.trim()) return setError("Title is required");
//     if (!form.slug.trim())  return setError("Slug is required");

//     setSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append("title", form.title.trim());
//       fd.append("slug",  form.slug.trim());
//       if (form.image) fd.append("image", form.image);

//       await axios.post(`${BASE}/checkup-types`, fd);
//       closeModal();
//       fetchAll();
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── FILTER ─────────────────────────────────────────────────────────────────

//   const filtered = list.filter((c) =>
//     c.title.toLowerCase().includes(search.toLowerCase()) ||
//     c.slug.toLowerCase().includes(search.toLowerCase())
//   );

//   // ── RENDER ─────────────────────────────────────────────────────────────────

//   return (
//     <div style={styles.page}>

//       {/* ── Header ── */}
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.pageTitle}>Checkup Types</h1>
//           <p style={styles.pageSub}>{list.length} total types</p>
//         </div>
//         <button style={styles.btnPrimary} onClick={openAdd}>+ Add Type</button>
//       </div>

//       {/* ── Search ── */}
//       <div style={styles.toolbar}>
//         <input
//           style={styles.searchInput}
//           placeholder="Search by title or slug..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* ── Table ── */}
//       <div style={styles.tableWrap}>
//         {loading ? (
//           <div style={styles.center}>Loading...</div>
//         ) : filtered.length === 0 ? (
//           <div style={styles.center}>No checkup types found</div>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 {["Image", "Title", "Slug", "Created At"].map((h) => (
//                   <th key={h} style={styles.th}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((item) => (
//                 <tr key={item._id} style={styles.tr}>
//                   <td style={styles.td}>
//                     {item.image?.url
//                       ? <img src={item.image.url} alt={item.title} style={styles.thumb} />
//                       : <div style={styles.thumbPlaceholder}>🏥</div>
//                     }
//                   </td>
//                   <td style={{ ...styles.td, fontWeight: 500 }}>{item.title}</td>
//                   <td style={styles.td}>
//                     <code style={styles.slug}>{item.slug}</code>
//                   </td>
//                   <td style={{ ...styles.td, color: "#888", fontSize: 13 }}>
//                     {new Date(item.createdAt).toLocaleDateString("en-IN", {
//                       day: "2-digit", month: "short", year: "numeric"
//                     })}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Note: Backend has no update/delete for CheckupType — add if needed */}

//       {/* ── Modal ── */}
//       {modal && (
//         <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
//           <div style={styles.modal}>
//             <div style={styles.modalHead}>
//               <h2 style={styles.modalTitle}>Add Checkup Type</h2>
//               <button style={styles.closeBtn} onClick={closeModal}>✕</button>
//             </div>

//             <form onSubmit={handleSave} style={styles.modalBody}>
//               {error && <div style={styles.errorBox}>{error}</div>}

//               {/* Title */}
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Title *</label>
//                 <input
//                   style={styles.input}
//                   placeholder="e.g., Full Body Checkup"
//                   value={form.title}
//                   onChange={(e) => onTitleChange(e.target.value)}
//                 />
//               </div>

//               {/* Slug */}
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>
//                   Slug *
//                   <span style={{ fontWeight: 400, color: "#aaa", marginLeft: 6 }}>
//                     (auto-generated)
//                   </span>
//                 </label>
//                 <input
//                   style={{ ...styles.input, fontFamily: "monospace", fontSize: 13, background: "#fafaf8" }}
//                   placeholder="full-body-checkup"
//                   value={form.slug}
//                   onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
//                 />
//               </div>

//               {/* Image */}
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Image (optional)</label>
//                 {preview && <img src={preview} alt="preview" style={styles.preview} />}
//                 <label style={styles.uploadBtn}>
//                   {form.image ? "Change Image" : "Upload Image"}
//                   <input type="file" accept="image/*" onChange={onImage} style={{ display: "none" }} />
//                 </label>
//                 {form.image && (
//                   <span style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
//                     {form.image.name}
//                   </span>
//                 )}
//               </div>

//               <div style={styles.modalFoot}>
//                 <button type="button" style={styles.btnSecondary} onClick={closeModal}>Cancel</button>
//                 <button type="submit" style={styles.btnPrimary} disabled={saving}>
//                   {saving ? "Saving..." : "Create"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── STYLES ────────────────────────────────────────────────────────────────────

// const styles = {
//   page:             { padding: "24px", fontFamily: "'DM Sans', sans-serif", color: "#1a1a18" },
//   header:           { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
//   pageTitle:        { fontSize: 22, fontWeight: 600, margin: 0 },
//   pageSub:          { fontSize: 13, color: "#888", marginTop: 4 },
//   toolbar:          { marginBottom: 14 },
//   searchInput:      { padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, width: 260, outline: "none", fontFamily: "inherit" },
//   tableWrap:        { background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" },
//   table:            { width: "100%", borderCollapse: "collapse" },
//   th:               { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#888", background: "#fafaf8", borderBottom: "1px solid #eee" },
//   tr:               { borderBottom: "1px solid #f0f0ee" },
//   td:               { padding: "12px 16px", fontSize: 14, verticalAlign: "middle" },
//   thumb:            { width: 40, height: 40, borderRadius: 8, objectFit: "cover", border: "1px solid #eee" },
//   thumbPlaceholder: { width: 40, height: 40, borderRadius: 8, background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
//   slug:             { background: "#f5f5f0", padding: "3px 8px", borderRadius: 5, fontSize: 12, fontFamily: "monospace", color: "#444" },
//   center:           { padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 },
//   btnPrimary:       { padding: "9px 16px", background: "#1a5cff", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
//   btnSecondary:     { padding: "9px 16px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
//   overlay:          { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
//   modal:            { background: "#fff", borderRadius: 14, width: 480, maxWidth: "94vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" },
//   modalHead:        { padding: "18px 22px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" },
//   modalTitle:       { fontSize: 16, fontWeight: 600, margin: 0 },
//   closeBtn:         { background: "#f5f5f0", border: "none", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 13 },
//   modalBody:        { padding: "20px 22px" },
//   modalFoot:        { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" },
//   formGroup:        { marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 },
//   label:            { fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" },
//   input:            { padding: "9px 11px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none" },
//   uploadBtn:        { display: "inline-block", padding: "8px 14px", background: "#f5f5f0", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 500, width: "fit-content" },
//   preview:          { width: 80, height: 80, borderRadius: 10, objectFit: "cover", border: "1px solid #eee", marginBottom: 8 },
//   errorBox:         { background: "#fcebeb", color: "#a32d2d", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 },
// };


import { useState, useEffect } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "https://userside-x164.onrender.com/api";

const INIT = { title: "", slug: "", image: null };

export default function CheckupTypes() {
  const [list, setList]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm]         = useState(INIT);
  const [preview, setPreview]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");

  // ── FETCH ──────────────────────────────────────────────────────────────────

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE}/checkup-types`);
      setList(data.data || []);
    } catch {
      setError("Failed to load checkup types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── SLUG AUTO-GENERATE ─────────────────────────────────────────────────────

  const onTitleChange = (val) => {
    const slug = val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, title: val, slug }));
  };

  // ── IMAGE ──────────────────────────────────────────────────────────────────

  const onImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  // ── OPEN / CLOSE ───────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditItem(null);
    setForm(INIT);
    setPreview(null);
    setError("");
    setModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title, slug: item.slug, image: null });
    setPreview(item.image?.url || null);
    setError("");
    setModal(true);
  };

  const closeModal = () => { setModal(false); setError(""); };

  // ── SAVE ───────────────────────────────────────────────────────────────────

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Title is required");
    if (!form.slug.trim())  return setError("Slug is required");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("slug",  form.slug.trim());
      if (form.image) fd.append("image", form.image);

      if (editItem) {
        await axios.put(`${BASE}/checkup-types/${editItem._id}`, fd);
      } else {
        await axios.post(`${BASE}/checkup-types`, fd);
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
    if (!window.confirm("Delete this checkup type?")) return;
    try {
      await axios.delete(`${BASE}/checkup-types/${id}`);
      fetchAll();
    } catch {
      alert("Delete failed");
    }
  };

  // ── FILTER ─────────────────────────────────────────────────────────────────

  const filtered = list.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div style={styles.page}>

      {/* ── Header ── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Checkup Types</h1>
          <p style={styles.pageSub}>{list.length} total types</p>
        </div>
        <button style={styles.btnPrimary} onClick={openAdd}>+ Add Type</button>
      </div>

      {/* ── Search ── */}
      <div style={styles.toolbar}>
        <input
          style={styles.searchInput}
          placeholder="Search by title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      <div style={styles.tableWrap}>
        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.center}>No checkup types found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {["Image", "Title", "Slug", "Created At", "Actions"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id} style={styles.tr}>

                  {/* Image */}
                  <td style={styles.td}>
                    {item.image?.url
                      ? <img src={item.image.url} alt={item.title} style={styles.thumb} />
                      : <div style={styles.thumbPlaceholder}>🏥</div>
                    }
                  </td>

                  {/* Title */}
                  <td style={{ ...styles.td, fontWeight: 500 }}>{item.title}</td>

                  {/* Slug */}
                  <td style={styles.td}>
                    <code style={styles.slug}>{item.slug}</code>
                  </td>

                  {/* Created At */}
                  <td style={{ ...styles.td, color: "#888", fontSize: 13 }}>
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}
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
              <h2 style={styles.modalTitle}>
                {editItem ? "Edit Checkup Type" : "Add Checkup Type"}
              </h2>
              <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSave} style={styles.modalBody}>
              {error && <div style={styles.errorBox}>{error}</div>}

              {/* Title */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  style={styles.input}
                  placeholder="e.g., Full Body Checkup"
                  value={form.title}
                  onChange={(e) => onTitleChange(e.target.value)}
                />
              </div>

              {/* Slug */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Slug *
                  <span style={{ fontWeight: 400, color: "#aaa", marginLeft: 6 }}>
                    (auto-generated)
                  </span>
                </label>
                <input
                  style={{ ...styles.input, fontFamily: "monospace", fontSize: 13, background: "#fafaf8" }}
                  placeholder="full-body-checkup"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                />
              </div>

              {/* Image */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Image (optional)
                  {editItem && <span style={{ fontWeight: 400, color: "#aaa", marginLeft: 6 }}>(leave empty to keep current)</span>}
                </label>
                {preview && <img src={preview} alt="preview" style={styles.preview} />}
                <label style={styles.uploadBtn}>
                  {form.image ? "Change Image" : preview ? "Replace Image" : "Upload Image"}
                  <input type="file" accept="image/*" onChange={onImage} style={{ display: "none" }} />
                </label>
                {form.image && (
                  <span style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                    {form.image.name}
                  </span>
                )}
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
  toolbar:          { marginBottom: 14 },
  searchInput:      { padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, width: 260, outline: "none", fontFamily: "inherit" },
  tableWrap:        { background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" },
  table:            { width: "100%", borderCollapse: "collapse" },
  th:               { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#888", background: "#fafaf8", borderBottom: "1px solid #eee" },
  tr:               { borderBottom: "1px solid #f0f0ee" },
  td:               { padding: "12px 16px", fontSize: 14, verticalAlign: "middle" },
  thumb:            { width: 40, height: 40, borderRadius: 8, objectFit: "cover", border: "1px solid #eee" },
  thumbPlaceholder: { width: 40, height: 40, borderRadius: 8, background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
  slug:             { background: "#f5f5f0", padding: "3px 8px", borderRadius: 5, fontSize: 12, fontFamily: "monospace", color: "#444" },
  actions:          { display: "flex", gap: 8 },
  center:           { padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 },
  btnPrimary:       { padding: "9px 16px", background: "#1a5cff", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnSecondary:     { padding: "9px 16px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnEdit:          { padding: "6px 12px", background: "#e8eeff", color: "#1a5cff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" },
  btnDelete:        { padding: "6px 12px", background: "#fcebeb", color: "#a32d2d", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" },
  overlay:          { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal:            { background: "#fff", borderRadius: 14, width: 480, maxWidth: "94vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" },
  modalHead:        { padding: "18px 22px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalTitle:       { fontSize: 16, fontWeight: 600, margin: 0 },
  closeBtn:         { background: "#f5f5f0", border: "none", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 13 },
  modalBody:        { padding: "20px 22px" },
  modalFoot:        { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" },
  formGroup:        { marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 },
  label:            { fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" },
  input:            { padding: "9px 11px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none" },
  uploadBtn:        { display: "inline-block", padding: "8px 14px", background: "#f5f5f0", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 500, width: "fit-content" },
  preview:          { width: 80, height: 80, borderRadius: 10, objectFit: "cover", border: "1px solid #eee", marginBottom: 8 },
  errorBox:         { background: "#fcebeb", color: "#a32d2d", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 },
};