import { useEffect, useState } from "react";
import { vehiculosApi } from "../api/vehiculosApi";
import BicicletaForm from "../components/BicicletaForm";
import MotoForm from "../components/MotoForm";

export default function VehiculosCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [tipoVehiculo, setTipoVehiculo] = useState("bicicleta");
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const loadVehiculos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await vehiculosApi.getVehiculosConDetalles();
      setItems(data);
    } catch (err) {
      setError("Error cargando vehículos: " + (err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehiculos();
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingItem) {
        // Actualizar vehículo base
        await vehiculosApi.update(editingItem.id_vehiculo, {
          id_tipo_vehiculo: formData.tipo === "bicicleta" ? 1 : 2,
          id_centro_de_formacion: formData.id_centro_de_formacion
        });
        
        // Actualizar detalles según tipo
        if (formData.tipo === "bicicleta") {
          await vehiculosApi.updateBicicleta(editingItem.detalles?.id_bicicleta, formData);
        } else {
          await vehiculosApi.updateMoto(editingItem.detalles?.id_moto, formData);
        }
      } else {
        // Crear nuevo vehículo
        const vehiculoData = {
          id_tipo_vehiculo: formData.tipo === "bicicleta" ? 1 : 2,
          id_centro_de_formacion: formData.id_centro_de_formacion
        };
        const vehiculoRes = await vehiculosApi.create(vehiculoData);
        
        // Crear detalles según tipo
        if (formData.tipo === "bicicleta") {
          await vehiculosApi.createBicicleta({
            id_vehiculo: vehiculoRes.data.id_vehiculo,
            ...formData
          });
        } else {
          await vehiculosApi.createMoto({
            id_vehiculo: vehiculoRes.data.id_vehiculo,
            ...formData
          });
        }
      }
      
      setShowForm(false);
      setEditingItem(null);
      await loadVehiculos();
      alert(`Vehículo ${editingItem ? "actualizado" : "creado"} exitosamente`);
    } catch (err) {
      setError("Error guardando vehículo: " + (err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar vehículo ID ${item.id_vehiculo}?`)) return;
    
    setLoading(true);
    try {
      if (item.tipo === "bicicleta" && item.detalles) {
        await vehiculosApi.deleteBicicleta(item.detalles.id_bicicleta);
      } else if (item.tipo === "moto" && item.detalles) {
        await vehiculosApi.deleteMoto(item.detalles.id_moto);
      }
      await vehiculosApi.remove(item.id_vehiculo);
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
      const vehiculo = await vehiculosApi.getById(searchId);
      let detalles = null;
      let tipo = "";
      
      try {
        const bicicletas = await vehiculosApi.getBicicletas();
        detalles = bicicletas.data.find(b => b.id_vehiculo === parseInt(searchId));
        if (detalles) tipo = "bicicleta";
      } catch {}
      
      if (!detalles) {
        const motos = await vehiculosApi.getMotos();
        detalles = motos.data.find(m => m.id_vehiculo === parseInt(searchId));
        if (detalles) tipo = "moto";
      }
      
      setSearchResult({ ...vehiculo.data, detalles, tipo });
    } catch (err) {
      setError("No se encontró el vehículo");
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
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: 5 }}
        >
          + Nuevo Vehículo
        </button>
      </div>

      {error && (
        <div style={{ background: "#f8d7da", color: "#721c24", padding: 10, borderRadius: 5, marginBottom: 20 }}>
          {error}
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
          <button onClick={searchById} style={{ padding: "8px 20px" }}>
            Buscar
          </button>
        </div>
        {searchResult && (
          <pre style={{ marginTop: 15, background: "white", padding: 10, borderRadius: 4, overflow: "auto" }}>
            {JSON.stringify(searchResult, null, 2)}
          </pre>
        )}
      </div>

      {/* Formulario */}
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
              <h3>{editingItem ? "Editar Vehículo" : "Nuevo Vehículo"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", fontSize: 20 }}>×</button>
            </div>
            
            <div style={{ marginBottom: 15 }}>
              <label>Tipo de Vehículo</label>
              <select 
                value={tipoVehiculo} 
                onChange={(e) => setTipoVehiculo(e.target.value)}
                style={{ width: "100%", padding: 8, marginTop: 5 }}
              >
                <option value="bicicleta">Bicicleta</option>
                <option value="moto">Moto</option>
              </select>
            </div>
            
            {tipoVehiculo === "bicicleta" ? (
              <BicicletaForm 
                onSubmit={handleSubmit}
                initialData={editingItem?.detalles}
                onCancel={() => setShowForm(false)}
                tipo={tipoVehiculo}
              />
            ) : (
              <MotoForm 
                onSubmit={handleSubmit}
                initialData={editingItem?.detalles}
                onCancel={() => setShowForm(false)}
                tipo={tipoVehiculo}
              />
            )}
          </div>
        </div>
      )}

      {/* Listado */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <thead style={{ background: "#f8f9fa" }}>
            <tr>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>ID</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Tipo</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Marca</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Color</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Serial</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Centro Formación</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id_vehiculo} style={{ borderBottom: "1px solid #dee2e6" }}>
                <td>{item.id_vehiculo}</td>
                <td>{item.tipo === "bicicleta" ? "🚲 Bicicleta" : "🏍️ Moto"}</td>
                <td>{item.detalles?.marca_de_la_bicicleta || item.detalles?.marca_de_la_moto || "-"}</td>
                <td>{item.detalles?.color_de_la_bicicleta || item.detalles?.color_de_la_moto || "-"}</td>
                <td>{item.detalles?.serial_de_la_bicicleta || item.detalles?.placa || "-"}</td>
                <td>{item.id_centro_de_formacion}</td>
                <td>
                  <button 
                    onClick={() => {
                      setEditingItem(item);
                      setTipoVehiculo(item.tipo);
                      setShowForm(true);
                    }}
                    style={{ marginRight: 10, padding: "5px 10px", background: "#28a745", color: "white", border: "none", borderRadius: 3 }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    style={{ padding: "5px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: 3 }}
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