// src/components/Start.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../Start.css';

const avatars = [
  "/img/bunnyF.png",
  "/img/cat.png",
  "/img/dog.png",
  "/img/frog.png",
  "/img/pandita.png",
  "/img/wolf.png",
  "/img/crocrodilo.png",
  "/img/TOROE.png",
];

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
      <h1>Super trivia party</h1>
      <img className="img" src="./img/reales.jpg" alt="" />
      <p>Ingresa tu apodo</p>
      <input className="nickname-input"
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="ej: Pablo"
        
      />

      <p>Escoge un avatar</p>
      <div className="avatars-container">
        {avatars.map((a, idx) => (
          <button
            key={idx}
            onClick={() => setAvatar(a)}
                className="avatar-selected"
                    style={{
    border: avatar === a ? "3px solid black" : "none",
    background: "transparent",
    padding: "0",
    borderRadius: "10px",
    cursor: "pointer"
  }}>
            <img
    src={a}
    alt={`Avatar ${idx}`}
    style={{
      display: "block",
      width: "60px",
      height: "60px",
      borderRadius: "10px",
      objectFit: "cover"
    }}
  />
          </button>
        ))}
      </div>

      <button className="button" onClick={handleStart}>Entrar al juego</button>
    </div>
  );
}
