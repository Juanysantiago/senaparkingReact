import { useState } from "react";
import { axiosClient } from "../api/axiosClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // POST http://localhost:3000/register
      const res = await axiosClient.post("/register", { email, password });

      // res.data = { accessToken, user: { email, id } }
      const { accessToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      alert(`Registro OK. Bienvenido ${user.email}`);
      // navigate("/dashboard"); // si usas react-router
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Error desconocido";
      setError("El correo ya existe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          style={{ width: "100%", padding: 8, margin: "6px 0 12px" }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <label>Password</label>
        <input
          style={{ width: "100%", padding: 8, margin: "6px 0 12px" }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        {error ? (
          <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>
        ) : null}

        <button disabled={loading} type="submit" style={{ width: "100%", padding: 10 }}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}