import { useState } from "react";
import { db } from "../firebase";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreate = async () => {
  setLoading(true);
  const roomCode = generateCode();
  const roomRef = ref(db, `rooms/${roomCode}`);

  const questions = [
    {
      question: "¿Cuál es la capital de Francia?",
      options: ["París", "Madrid", "Roma", "Berlín"],
      answer: "París"
    },
    {
      question: "¿Qué lenguaje se usa en React?",
      options: ["Python", "JavaScript", "Ruby", "C#"],
      answer: "JavaScript"
    }
  ];

  await set(roomRef, {
    createdAt: Date.now(),
    players: [],
    started: false,
    questions: questions
  });

  setLoading(false);
  navigate(`/room/${roomCode}`);
};


  return (
    <div className="trivia-container">
      <h2>Crear Sala</h2>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creando..." : "Generar preguntas"}
      </button>
    </div>
  );
}
