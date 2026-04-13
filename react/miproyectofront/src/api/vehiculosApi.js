import { axiosClient } from "./axiosClient";

export const vehiculosApi = {
  // Vehículos base
  list: () => axiosClient.get("/vehiculo"),
  getById: (id) => axiosClient.get(`/vehiculo/${id}`),
  create: (data) => axiosClient.post("/vehiculo", data),
  update: (id, data) => axiosClient.put(`/vehiculo/${id}`, data),
  remove: (id) => axiosClient.delete(`/vehiculo/${id}`),
  
  // Bicicletas
  getBicicletas: () => axiosClient.get("/bicicleta"),
  getBicicletaById: (id) => axiosClient.get(`/bicicleta/${id}`),
  createBicicleta: (data) => axiosClient.post("/bicicleta", data),
  updateBicicleta: (id, data) => axiosClient.put(`/bicicleta/${id}`, data),
  deleteBicicleta: (id) => axiosClient.delete(`/bicicleta/${id}`),
  
  // Motos
  getMotos: () => axiosClient.get("/moto"),
  getMotoById: (id) => axiosClient.get(`/moto/${id}`),
  createMoto: (data) => axiosClient.post("/moto", data),
  updateMoto: (id, data) => axiosClient.put(`/moto/${id}`, data),
  deleteMoto: (id) => axiosClient.delete(`/moto/${id}`),
  
  // Relaciones
  getVehiculosConDetalles: async () => {
    const [vehiculos, bicicletas, motos] = await Promise.all([
      axiosClient.get("/vehiculo"),
      axiosClient.get("/bicicleta"),
      axiosClient.get("/moto")
    ]);
    
    // Combinar datos
    return vehiculos.data.map(vehiculo => {
      const bicicleta = bicicletas.data.find(b => b.id_vehiculo === vehiculo.id_vehiculo);
      const moto = motos.data.find(m => m.id_vehiculo === vehiculo.id_vehiculo);
      return {
        ...vehiculo,
        detalles: bicicleta || moto,
        tipo: bicicleta ? "bicicleta" : moto ? "moto" : "desconocido"
      };
    });
  }
};