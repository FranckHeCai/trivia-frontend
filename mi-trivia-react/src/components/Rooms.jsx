import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

// Mezclar opciones (Fisher–Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Room() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Cargar preguntas de Firebase
  useEffect(() => {
    const roomRef = ref(db, `rooms/${code}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        alert("La sala no existe.");
        return;
      }
      if (data.questions) {
        const shuffled = data.questions.map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));
        setQuestions(shuffled);
      }
    });
  }, [code]);

  const handleAnswer = (option) => {
    if (selected) return;

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

  const getButtonClass = (option) => {
    if (!selected) return "";
    if (option === questions[current].answer) return "correct";
    if (option === selected) return "incorrect";
    return "";
  };

  return (
    <div className="trivia-container">
      <h2>Sala: {code}</h2>

      {finished ? (
        <div>
          <p>🎉 Juego terminado. Tu puntuación: {score} / {questions.length}</p>
          <button onClick={() => navigate("/")} style={{ marginTop: "1rem" }}>
            Volver al menú
          </button>
        </div>
      ) : questions.length > 0 ? (
        <>
          <h3>{questions[current].question}</h3>
          {questions[current].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              className={getButtonClass(opt)}
              disabled={selected}
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
