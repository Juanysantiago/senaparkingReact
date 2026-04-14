import { useState } from 'react'
import './App.css'

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TipoDocumentosCrud from "./pages/TipoDocumentosCrud";
import VehiculosCrud from './pages/VehiculosCrud';
import ConfigGrCrud from './pages/ConfigGrCrud';
import EntradaSalidaCrud from './pages/EntradaSalidaCrud';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tipo-documentos" element={<TipoDocumentosCrud />} />
        <Route path="/vehiculos" element={<VehiculosCrud />} />
        <Route path="/config-gr" element={<ConfigGrCrud />} />
        <Route path="/entrada-salida" element={<EntradaSalidaCrud />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
