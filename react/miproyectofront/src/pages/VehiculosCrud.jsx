// /src/pages/VehiculosCrud.jsx - VERSIÓN SIMPLIFICADA QUE SÍ FUNCIONA
import { useEffect, useState } from "react";
import { vehiculosApi } from "../api/vehiculosApi";

export default function VehiculosCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    tipo: "bicicleta",
    id_centro_de_formacion: "",
    marca: "",
    color: "",
    serial: "",
    placa: "",
    cilindraje: "",
    modelo: "",
    foto_principal: "",
    foto_secundaria: ""
  });

  const loadVehiculos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await vehiculosApi.list();
      setItems(res.data);
    } catch (err) {
      setError("Error cargando vehículos: " + (err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehiculos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setFormData({
      tipo: "bicicleta",
      id_centro_de_formacion: "",
      marca: "",
      color: "",
      serial: "",
      placa: "",
      cilindraje: "",
      modelo: "",
      foto_principal: "",
      foto_secundaria: ""
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setFormData({
      tipo: item.tipo,
      id_centro_de_formacion: item.id_centro_de_formacion,
      marca: item.marca,
      color: item.color,
      serial: item.serial,
      placa: item.placa || "",
      cilindraje: item.cilindraje || "",
      modelo: item.modelo || "",
      foto_principal: item.foto_principal || "",
      foto_secundaria: item.foto_secundaria || ""
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validaciones básicas
    if (!formData.marca || !formData.serial || !formData.id_centro_de_formacion) {
      setError("Marca, serial y centro de formación son obligatorios");
      setLoading(false);
      return;
    }
    
    if (formData.tipo === "moto" && !formData.placa) {
      setError("La placa es obligatoria para motos");
      setLoading(false);
      return;
    }
    
    try {
      if (editingItem) {
        // Actualizar
        await vehiculosApi.update(editingItem.id, formData);
        alert("Vehículo actualizado exitosamente");
      } else {
        // Crear nuevo
        await vehiculosApi.create(formData);
        alert("Vehículo creado exitosamente");
      }
      
      setShowForm(false);
      setEditingItem(null);
      await loadVehiculos();
      
    } catch (err) {
      console.error("Error:", err);
      setError("Error guardando vehículo: " + (err.response?.data?.message || err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar vehículo "${item.marca}" (ID: ${item.id})?`)) return;
    
    setLoading(true);
    try {
      await vehiculosApi.remove(item.id);
      await loadVehiculos();
      alert("Vehículo eliminado exitosamente");
    } catch (err) {
      setError("Error eliminando vehículo: " + (err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const searchById = async () => {
    if (!searchId.trim()) {
      setError("Ingrese un ID para buscar");
      return;
    }
    
    setLoading(true);
    try {
      const res = await vehiculosApi.getById(searchId);
      setSearchResult(res.data);
    } catch (err) {
      setError("No se encontró el vehículo con ID " + searchId);
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Gestión de Vehículos</h2>
        <button 
          onClick={openCreateForm}
          style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}
        >
          + Nuevo Vehículo
        </button>
      </div>

      {error && (
        <div style={{ background: "#f8d7da", color: "#721c24", padding: 10, borderRadius: 5, marginBottom: 20 }}>
          ❌ {error}
        </div>
      )}

      {/* Buscador */}
      <div style={{ background: "#f8f9fa", padding: 15, borderRadius: 5, marginBottom: 20 }}>
        <h3>Buscar Vehículo por ID</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="ID del vehículo"
            style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
          />
          <button onClick={searchById} disabled={loading} style={{ padding: "8px 20px", cursor: "pointer" }}>
            Buscar
          </button>
        </div>
        {searchResult && (
          <pre style={{ marginTop: 15, background: "white", padding: 10, borderRadius: 4, overflow: "auto" }}>
            {JSON.stringify(searchResult, null, 2)}
          </pre>
        )}
      </div>

      {/* Modal del Formulario */}
      {showForm && (
        <div style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{ 
            background: "white", 
            padding: 30, 
            borderRadius: 10, 
            maxWidth: 600, 
            maxHeight: "90vh", 
            overflow: "auto",
            width: "100%"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3>{editingItem ? `Editar Vehículo` : "Nuevo Vehículo"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Tipo de vehículo - solo visible en creación */}
              {!editingItem && (
                <div style={{ marginBottom: 15 }}>
                  <label>Tipo de Vehículo *</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
                  >
                    <option value="bicicleta">🚲 Bicicleta</option>
                    <option value="moto">🏍️ Moto</option>
                  </select>
                </div>
              )}
              
              <div style={{ marginBottom: 15 }}>
                <label>Centro de Formación ID *</label>
                <input
                  type="number"
                  name="id_centro_de_formacion"
                  value={formData.id_centro_de_formacion}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
                />
              </div>
              
              <div style={{ marginBottom: 15 }}>
                <label>Marca *</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
                />
              </div>
              
              <div style={{ marginBottom: 15 }}>
                <label>Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
                />
              </div>
              
              <div style={{ marginBottom: 15 }}>
                <label>Serial *</label>
                <input
                  type="text"
                  name="serial"
                  value={formData.serial}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
                />
              </div>
              
              {/* Campos específicos para moto */}
              {formData.tipo === "moto" && (
                <>
                  <div style={{ marginBottom: 15 }}>
                    <label>Placa *</label>
                    <input
                      type="text"
                      name="placa"
                      value={formData.placa}
                      onChange={handleChange}
                      required
                      style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 15 }}>
                    <label>Cilindraje</label>
                    <input
                      type="text"
                      name="cilindraje"
                      value={formData.cilindraje}
                      onChange={handleChange}
                      placeholder="Ej: 200cc"
                      style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 15 }}>
                    <label>Modelo</label>
                    <input
                      type="text"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleChange}
                      placeholder="Ej: 2023"
                      style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
                    />
                  </div>
                </>
              )}
              
              <div style={{ marginBottom: 15 }}>
                <label>URL Foto Principal</label>
                <input
                  type="text"
                  name="foto_principal"
                  value={formData.foto_principal}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/foto.jpg"
                  style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
                />
              </div>
              
              <div style={{ marginBottom: 15 }}>
                <label>URL Foto Secundaria</label>
                <input
                  type="text"
                  name="foto_secundaria"
                  value={formData.foto_secundaria}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/foto2.jpg"
                  style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
                />
              </div>
              
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" disabled={loading} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de vehículos */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <thead style={{ background: "#f8f9fa" }}>
            <tr>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>ID</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Tipo</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Marca</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Color/Placa</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Serial</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Centro</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                <td style={{ padding: 12 }}>{item.id}</td>
                <td style={{ padding: 12 }}>{item.tipo === "bicicleta" ? "🚲 Bicicleta" : "🏍️ Moto"}</td>
                <td style={{ padding: 12 }}>{item.marca}</td>
                <td style={{ padding: 12 }}>{item.tipo === "moto" ? item.placa : item.color}</td>
                <td style={{ padding: 12 }}>{item.serial}</td>
                <td style={{ padding: 12 }}>{item.id_centro_de_formacion}</td>
                <td style={{ padding: 12 }}>
                  <button 
                    onClick={() => openEditForm(item)}
                    style={{ marginRight: 10, padding: "5px 10px", background: "#28a745", color: "white", border: "none", borderRadius: 3, cursor: "pointer" }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    style={{ padding: "5px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: 3, cursor: "pointer" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 40 }}>
                  No hay vehículos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}