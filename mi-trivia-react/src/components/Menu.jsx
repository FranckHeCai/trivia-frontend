// src/components/Menu.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Menu() {
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("nickname");
    const icon = localStorage.getItem("avatar");
    if (!name) {
      navigate("/"); // si no hay datos, redirige al inicio
    } else {
      setNickname(name);
      setAvatar(icon);
    }
  }, [navigate]);

  return (
    <div className="trivia-container">
      <h2>👋 ¡Hola, {nickname}!</h2>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{avatar}</div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link to="/create">
          <button>Crear Sala</button>
        </Link>
        <Link to="/join">
          <button>Unirse a Sala</button>
        </Link>
      </div>
    </div>
  );
}
