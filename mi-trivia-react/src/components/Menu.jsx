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
      <h2>Bienvenido, {nickname}!</h2>
      <p>Quien conoce mejor a quien? Reta a tus amigos creando una sala o uniendote a una.</p>
      {avatar && (
      <div  style={{ marginBottom: "1rem" }}>
          <img
    src={avatar}
    alt="avatar"
    style={{
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover"
    }}
  />
 </div>)}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link to="/create">
          <button className="button">Crear Sala</button>
        </Link>
        <Link to="/join">
          <button className="button">Unirse a Sala</button>
        </Link>
      </div>
    </div>
  );
}
