import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "8px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: isActive ? "white" : "#111",
  background: isActive ? "#111" : "transparent",
});

export default function Navbar() {
  const token = localStorage.getItem("accessToken");

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/"; // simple y efectivo
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 16px",
        borderBottom: "1px solid #eee",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <strong>Mi App</strong>

        <NavLink to="/" style={linkStyle}>
          Inicio
        </NavLink>
        <NavLink to="/login" style={linkStyle}>
          Login
        </NavLink>
        <NavLink to="/register" style={linkStyle}>
          Registro
        </NavLink>
        <NavLink to="/tipo-documentos" style={linkStyle}>
          Tipo Documentos
        </NavLink>
        <NavLink to="/vehiculos" style={linkStyle}>
          Vehículos
        </NavLink>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, color: "#444" }}>
          {token ? "Autenticado" : "No autenticado"}
        </span>
        {token ? (
          <button onClick={logout} style={{ padding: "8px 12px" }}>
            Salir
          </button>
        ) : null}
      </div>
    </nav>
  );
}