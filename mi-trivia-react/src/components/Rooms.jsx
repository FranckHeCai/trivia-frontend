// src/components/Room.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, update } from "firebase/database";

export default function Room() {
  const { code } = useParams();
  const [nickname] = useState(localStorage.getItem("nickname"));
  const [avatar] = useState(localStorage.getItem("avatar"));
  const [players, setPlayers] = useState({});
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [roomFull, setRoomFull] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [assigned, setAssigned] = useState(null);
  const [assignedQuestion, setAssignedQuestion] = useState(null);

  const userId = `${nickname}-${Math.random().toString(36).substr(2, 5)}`;

  useEffect(() => {
    const roomRef = ref(db, `rooms/${code}`);

    onValue(roomRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        alert("La sala no existe.");
        return;
      }

      const playersInRoom = data.players || {};
      const questions = data.questions || {};
      const alreadyInRoom = Object.values(playersInRoom).some((p) => p.nickname === nickname);

      setPlayers(playersInRoom);
      setMaxPlayers(data.maxPlayers);
      setRoomFull(Object.keys(playersInRoom).length >= data.maxPlayers);

      if (!alreadyInRoom && Object.keys(playersInRoom).length < data.maxPlayers) {
        update(ref(db, `rooms/${code}/players/${userId}`), {
          nickname,
          avatar,
        });
      }

      if (
        roomFull &&
        Object.keys(questions).length === data.maxPlayers &&
        !Object.values(playersInRoom).some((p) => p.assignedQuestionId)
      ) {
        const playerIds = Object.keys(playersInRoom);
        const shuffled = [...playerIds];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Asignar a cada jugador la pregunta del siguiente (no la suya)
        for (let i = 0; i < playerIds.length; i++) {
          const current = playerIds[i];
          const next = shuffled[(i + 1) % playerIds.length];
          update(ref(db, `rooms/${code}/players/${current}`), {
            assignedQuestionId: next,
          });
        }
      }

      // Obtener pregunta asignada si ya se asignó
      const currentPlayer = playersInRoom[userId];
      if (currentPlayer && currentPlayer.assignedQuestionId) {
        setAssigned(currentPlayer.assignedQuestionId);
        setAssignedQuestion(questions[currentPlayer.assignedQuestionId]);
      }
    });
  }, [code, nickname, avatar, roomFull, userId]);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmitQuestion = async () => {
    if (!question.trim() || options.some((opt) => !opt.trim()) || correctIndex === null) return;

    await update(ref(db, `rooms/${code}/questions/${userId}`), {
      question,
      options,
      answer: options[correctIndex],
    });
    setSubmitted(true);
  };

  return (
    <div className="trivia-container">
      <h2>Sala: {code}</h2>
      <p>Jugadores conectados ({Object.keys(players).length} / {maxPlayers})</p>

      <ul>
        {Object.values(players).map((p, i) => (
          <li key={i}>{p.avatar} {p.nickname}</li>
        ))}
      </ul>

      {roomFull && !submitted ? (
        <div>
          <p>Escribe una pregunta para otro jugador:</p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
            placeholder="Escribe tu pregunta"
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <p>Respuestas (marca la correcta):</p>
          {options.map((opt, idx) => (
            <div key={idx} style={{ marginBottom: "0.5rem" }}>
              <input
                type="radio"
                name="correctOption"
                checked={correctIndex === idx}
                onChange={() => setCorrectIndex(idx)}
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(e.target.value, idx)}
                placeholder={`Opción ${idx + 1}`}
                style={{ marginLeft: "0.5rem" }}
              />
            </div>
          ))}

          <button onClick={handleSubmitQuestion} style={{ marginTop: "1rem" }}>Enviar Pregunta</button>
        </div>
      ) : null}

      {submitted && !assignedQuestion ? (
        <p>✅ Pregunta enviada. Esperando asignación...</p>
      ) : null}

      {assignedQuestion && (
        <div style={{ marginTop: "2rem" }}>
          <h3>❓ Pregunta para ti:</h3>
          <p>{assignedQuestion.question}</p>
          {assignedQuestion.options.map((opt, idx) => (
            <button key={idx} style={{ display: "block", margin: "0.5rem 0" }}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}