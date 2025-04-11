// src/components/Start.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const avatars = ["😀", "😎", "🤖", "👽", "🐱", "🐶", "🦄"];

export default function Start() {
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const navigate = useNavigate();

  const handleStart = () => {
    if (!nickname.trim()) {
      alert("Por favor, ingresa un apodo.");
      return;
    }

    // Guardar en localStorage (puede usarse en Room luego)
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("avatar", avatar);

    // Ir al menú principal
    navigate("/menu");
  };

  return (
    <div className="trivia-container">
      <h1>🎉 Question Party Game</h1>
      <p>Ingresa tu apodo:</p>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="ej: Pablo"
        style={{ padding: "10px", borderRadius: "8px", marginBottom: "1rem" }}
      />

      <p>Escoge un avatar:</p>
      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
        {avatars.map((a, idx) => (
          <button
            key={idx}
            onClick={() => setAvatar(a)}
            style={{
              fontSize: "1.5rem",
              background: avatar === a ? "lightgreen" : "white",
              borderRadius: "8px",
              padding: "0.3rem 0.6rem"
            }}
          >
            {a}
          </button>
        ))}
      </div>

      <button onClick={handleStart}>Entrar al juego</button>
    </div>
  );
}
