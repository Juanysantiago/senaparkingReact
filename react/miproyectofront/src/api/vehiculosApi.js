// /src/api/vehiculosApi.js
import { axiosClient } from "./axiosClient";

export const vehiculosApi = {
  // Obtener todos los vehículos (versión simplificada)
  list: () => axiosClient.get("/vehiculos_completo"),
  
  // Obtener por ID
  getById: (id) => axiosClient.get(`/vehiculos_completo/${id}`),
  
  // Crear nuevo vehículo
  create: (data) => axiosClient.post("/vehiculos_completo", data),
  
  // Actualizar vehículo
  update: (id, data) => axiosClient.put(`/vehiculos_completo/${id}`, data),
  
  // Eliminar vehículo
  remove: (id) => axiosClient.delete(`/vehiculos_completo/${id}`)
};