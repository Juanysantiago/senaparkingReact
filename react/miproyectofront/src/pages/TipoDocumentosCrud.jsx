import { useEffect, useMemo, useState } from "react";
import { tipoDocumentosApi } from "../api/tipoDocumentosApi";

const emptyForm = { sigla: "", nombre_documento: "" };

export default function TipoDocumentosCrud() {
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null); // si no es null => update
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [error, setError] = useState("");

  const loadList = async () => {
    setError("");
    setLoadingList(true);
    try {
      const res = await tipoDocumentosApi.list();
      setItems(res.data);
    } catch (err) {
      setError(err?.response?.statusText || err?.message || "Error listando");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      sigla: item.sigla ?? "",
      nombre_documento: item.nombre_documento ?? "",
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.sigla.trim() || !form.nombre_documento.trim()) {
      setError("sigla y nombre_documento son obligatorios");
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await tipoDocumentosApi.update(editingId, {
          sigla: form.sigla,
          nombre_documento: form.nombre_documento,
        });
      } else {
        await tipoDocumentosApi.create({
          sigla: form.sigla,
          nombre_documento: form.nombre_documento,
        });
      }

      startCreate();
      await loadList();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Error guardando";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const ok = window.confirm(`¿Eliminar tipo-documento con id=${id}?`);
    if (!ok) return;

    setError("");
    try {
      await tipoDocumentosApi.remove(id);
      if (editingId === id) startCreate();
      await loadList();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Error eliminando";
      setError(msg);
    }
  };

  const searchById = async () => {
    setError("");
    setSearchResult(null);

    const id = searchId.trim();
    if (!id) {
      setError("Escribe un id para buscar (ej: 1 o ZeV_Cea)");
      return;
    }

    setSearchLoading(true);
    try {
      const res = await tipoDocumentosApi.getById(id);
      setSearchResult(res.data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) setError("No encontrado (404)");
      else setError(err?.response?.statusText || err?.message || "Error buscando");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>CRUD - Tipos de Documento</h2>

      {error ? (
        <div style={{ background: "#ffe7e7", color: "#7a0000", padding: 10, marginBottom: 12 }}>
          {error}
        </div>
      ) : null}

      {/* Crear / Editar */}
      <div style={{ border: "1px solid #ddd", padding: 14, borderRadius: 8, marginBottom: 18 }}>
        <h3 style={{ marginTop: 0 }}>{isEditing ? `Editar (id=${editingId})` : "Crear nuevo"}</h3>

        <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 10 }}>
          <div>
            <label>Sigla</label>
            <input
              name="sigla"
              value={form.sigla}
              onChange={onChange}
              style={{ width: "100%", padding: 8 }}
              placeholder="TI"
            />
          </div>

          <div>
            <label>Nombre documento</label>
            <input
              name="nombre_documento"
              value={form.nombre_documento}
              onChange={onChange}
              style={{ width: "100%", padding: 8 }}
              placeholder="tarjeta de identidad"
            />
          </div>

          <div style={{ display: "flex", alignItems: "end", gap: 8 }}>
            <button type="submit" disabled={saving} style={{ padding: "9px 12px" }}>
              {saving ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </button>
            {isEditing ? (
              <button type="button" onClick={startCreate} style={{ padding: "9px 12px" }}>
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </div>

      {/* Buscar por ID */}
      <div style={{ border: "1px solid #ddd", padding: 14, borderRadius: 8, marginBottom: 18 }}>
        <h3 style={{ marginTop: 0 }}>Buscar por ID</h3>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder='Ej: 1 o "ZeV_Cea"'
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={searchById} disabled={searchLoading} style={{ padding: "9px 12px" }}>
            {searchLoading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {searchResult ? (
          <pre style={{ marginTop: 12, background: "#f6f8fa", padding: 12, overflow: "auto" }}>
            {JSON.stringify(searchResult, null, 2)}
          </pre>
        ) : null}
      </div>

      {/* Listado */}
      <div style={{ border: "1px solid #ddd", padding: 14, borderRadius: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <h3 style={{ marginTop: 0 }}>Listado</h3>
          <button onClick={loadList} disabled={loadingList} style={{ padding: "9px 12px" }}>
            {loadingList ? "Cargando..." : "Refrescar"}
          </button>
        </div>

        {loadingList ? <div>Cargando...</div> : null}

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "8px 6px" }}>ID</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "8px 6px" }}>Sigla</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "8px 6px" }}>
                Nombre documento
              </th>
              <th style={{ borderBottom: "1px solid #eee", padding: "8px 6px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ borderBottom: "1px solid #f2f2f2", padding: "8px 6px" }}>{it.id}</td>
                <td style={{ borderBottom: "1px solid #f2f2f2", padding: "8px 6px" }}>{it.sigla}</td>
                <td style={{ borderBottom: "1px solid #f2f2f2", padding: "8px 6px" }}>{it.nombre_documento}</td>
                <td style={{ borderBottom: "1px solid #f2f2f2", padding: "8px 6px" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button onClick={() => startEdit(it)} style={{ padding: "6px 10px" }}>
                      Editar
                    </button>
                    <button onClick={() => remove(it.id)} style={{ padding: "6px 10px" }}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 10 }}>
                  Sin registros
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}