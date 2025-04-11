// src/components/Room.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, update, push } from "firebase/database";

export default function Room() {
  const { code } = useParams();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [players, setPlayers] = useState([]);
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    const roomRef = ref(db, `rooms/${code}`);

    // Check if room exists and fetch questions
    alert(3333)
    onValue(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        alert("La sala no existe.");
        return;
      }
      const data = snapshot.val();
      if (data.questions) setQuestions(data.questions);
      if (data.players) setPlayers(data.players);
    });
    alert(444)

    // Register current player
    const playerRef = ref(db, `rooms/${code}/players/${userId}`);
    update(playerRef, { joinedAt: Date.now() });
  }, [code, userId]);

  const handleAnswer = (option) => {
    setSelected(option);
    const isCorrect = option === questions[current].answer;
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  const getClass = (option) => {
    if (!selected) return "";
    if (option === questions[current].answer) return "correct";
    if (option === selected) return "incorrect";
    return "";
  };

  return (
    <div className="trivia-container">
      <h2>Sala: {code}</h2>

      <div>
        <h4>Jugadores conectados:</h4>
        <ul>
          {Object.keys(players || {}).map((id) => (
            <li key={id}>👤 {id}</li>
          ))}
        </ul>
      </div>

      {finished ? (
        <p>Juego terminado. Puntos: {score}</p>
      ) : questions.length > 0 ? (
        <>
          <h3>{questions[current].question}</h3>
          {questions[current].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              disabled={selected}
              className={getClass(opt)}
            >
              {opt}
            </button>
          ))}
        </>
      ) : (
        <p>Cargando preguntas...</p>
      )}
    </div>
  );
}
