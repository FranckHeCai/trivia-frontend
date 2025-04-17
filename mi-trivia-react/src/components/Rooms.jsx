import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, update, get } from "firebase/database";

export default function Room() {
  const { code } = useParams();
  const [nickname] = useState(localStorage.getItem("nickname"));
  const [avatar] = useState(localStorage.getItem("avatar"));
  const [userId] = useState(`${nickname}-${Math.random().toString(36).substr(2, 5)}`);

  const [players, setPlayers] = useState({});
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [roomFull, setRoomFull] = useState(false);
  const [creator, setCreator] = useState(null);
  const [started, setStarted] = useState(false);
  const [questionsPerPlayer, setQuestionsPerPlayer] = useState(1);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [submittedCount, setSubmittedCount] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(null);
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [score, setScore] = useState({});

  const [timer, setTimer] = useState(15);


  useEffect(() => {
    const roomRef = ref(db, `rooms/${code}`);

    const unsubscribe = onValue(roomRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        alert("La sala no existe.");
        return;
      }

      const playersInRoom = data.players || {};
      const alreadyInRoom = Object.values(playersInRoom).some(
        (p) => p.nickname === nickname
      );

      setPlayers(playersInRoom);
      setMaxPlayers(data.maxPlayers);
      setCreator(data.creator);
      setStarted(data.started || false);
      setRoomFull(Object.keys(playersInRoom).length >= data.maxPlayers);
      setQuestionsPerPlayer(data.questionsPerPlayer || 1);
      setCurrentQuestion(data.currentQuestion || null);
      setRound(data.round || 0);
      setTotalRounds(data.totalRounds || 0);
      setScore(data.score || {});

     if (!alreadyInRoom && Object.keys(playersInRoom).length < data.maxPlayers) {
  await update(ref(db, `rooms/${code}/players/${userId}`), {
    nickname,
    avatar,
  });

  const scorePath = ref(db, `rooms/${code}/score/${nickname}`);
  const scoreSnap = await get(scorePath);
  if (!scoreSnap.exists()) {
    await update(ref(db, `rooms/${code}/score`), {
      [nickname]: 0,
    });
  }
}
      



      
    });
    
    
    return () => unsubscribe();
  }, [code, nickname, avatar, userId]);

  useEffect(() => {
    const questionsRef = ref(db, `rooms/${code}/questions`);

    const unsubscribe = onValue(questionsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const myQuestions = Object.entries(data).filter(([key]) =>
        key.startsWith(nickname)
      );
      setSubmittedCount(myQuestions.length);
    });

    return () => unsubscribe();
  }, [code, nickname]);

  useEffect(() => {
    const checkAnswered = async () => {
      const snapshot = await get(ref(db, `rooms/${code}/answers/${round}/${nickname}`));
      setAnswered(snapshot.exists());
    };

    if (started && currentQuestion && round <= totalRounds) {
      checkAnswered();
    }
  }, [round, currentQuestion, nickname, code, started, totalRounds]);

useEffect(() => {
  if (!started || round > totalRounds || !currentQuestion) return;

  setTimer(15);
  const interval = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        handleAnswer("__NO_ANSWER__");
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [started, round, totalRounds, currentQuestion?.question]);



  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

const handleAnswer = async (selected) => {
  const answerRef = ref(db, `rooms/${code}/answers/${round}/${nickname}`);
  const hasAnswered = (await get(answerRef)).exists();

  if (hasAnswered) {
    console.log("Respuesta ya registrada, no se vuelve a actualizar");
    return;
  }

  // const isCorrect = selected === currentQuestion.answer;
  // setWasCorrect(isCorrect);
  // setAnswered(true);
  const isCorrect = selected === currentQuestion.answer;
if (selected === "__NO_ANSWER__") {
  setWasCorrect(false);
} else {
  setWasCorrect(isCorrect);
  setAnswered(true);
}

  // Marca que ya respondió
await update(answerRef, { answered: true });

  // ✅ Actualizar el score directamente
  const scorePath = ref(db, `rooms/${code}/score/${nickname}`);
  const currentScoreSnap = await get(scorePath);
  const prevScore = currentScoreSnap.exists() ? currentScoreSnap.val() : 0;

  await update(ref(db, `rooms/${code}/score`), {
    [nickname]: isCorrect ? prevScore + 1 : prevScore,
  });

  console.log(`${nickname} respondió ${selected}. Correcta: ${isCorrect}`);
};


  const handleSubmitQuestion = async () => {
    if (!question.trim() || options.some((opt) => !opt.trim()) || correctIndex === null) return;

    const questionId = `${nickname}-${Date.now()}`;

    await update(ref(db, `rooms/${code}/questions/${questionId}`), {
      question,
      options,
      answer: options[correctIndex],
    });

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(null);
    setSubmittedCount(submittedCount + 1);
  };

  const handleStartGame = async () => {
    const snapshot = await get(ref(db, `rooms/${code}/questions`));
    const allQuestions = snapshot.val() || {};
const questionArray = Object.entries(allQuestions)
  .filter(([key]) => key.includes("-")) // Asegura que sea una pregunta válida
  .map(([, q]) => q);
    if (questionArray.length === 0) {
      alert("No hay preguntas para iniciar.");
      return;
    }

    const shuffled = [...questionArray].sort(() => 0.5 - Math.random());

    await update(ref(db, `rooms/${code}`), {
      started: true,
      round: 1,
      totalRounds: shuffled.length,
      currentQuestion: shuffled[0],
      questionPool: shuffled,
    });
  };

  const handleNextRound = async () => {
    const snapshot = await get(ref(db, `rooms/${code}`));
    const data = snapshot.val();

    const pool = data.questionPool || [];
    const nextRound = data.round + 1;

    if (nextRound > pool.length) {
      await update(ref(db, `rooms/${code}`), {
        currentQuestion: null,
        round: nextRound
      });
      return;
    }

    await update(ref(db, `rooms/${code}`), {
      currentQuestion: pool[nextRound - 1],
      round: nextRound,
    });

    setAnswered(false);
    setWasCorrect(null);
  };

  const handleRestartGame = async () => {
  const snapshot = await get(ref(db, `rooms/${code}/questionPool`));
  const pool = snapshot.val();

  if (!pool || pool.length === 0) {
    alert("No hay preguntas guardadas.");
    return;
  }

  await update(ref(db, `rooms/${code}`), {
    round: 1,
    started: true,
    totalRounds: pool.length,
    currentQuestion: pool[0],
    score: {}, // reinicia puntajes
    answers: {}, // limpia respuestas
  });

  setAnswered(false);
  setWasCorrect(null);
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
        {Object.keys(score).length > 0 && (
  <div style={{ marginBottom: "1rem", fontWeight: "bold" }}>
    🏅 Liderando:{" "}
    {
      Object.entries(score).sort(([, a], [, b]) => b - a)[0][0]
    } con {Object.entries(score).sort(([, a], [, b]) => b - a)[0][1]} punto(s)
  </div>
)}
      {!started && roomFull && submittedCount < questionsPerPlayer && (
        <div style={{ marginTop: "2rem" }}>
          <p>Escribe una pregunta:</p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
            placeholder="Escribe tu pregunta"
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <p>Opciones (marca la correcta):</p>
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

          <button onClick={handleSubmitQuestion} style={{ marginTop: "1rem" }}>
            Enviar Pregunta
          </button>
        </div>
      )}

      {!started && roomFull && submittedCount >= questionsPerPlayer && (
        <p style={{ marginTop: "2rem" }}>✅ Has enviado todas tus preguntas.</p>
      )}

      {!started && nickname === creator && roomFull && (
        <button onClick={handleStartGame} style={{ marginTop: "2rem" }}>
          🚀 Empezar Partida
        </button>
      )}

      {started && currentQuestion && !answered && round <= totalRounds && (
        <div style={{ marginTop: "2rem" }}>
          <p>⏱ Tiempo restante: {timer}s</p>
          <h3>❓ Pregunta (Ronda {round} de {totalRounds}):</h3>
          <p>{currentQuestion.question}</p>
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
              style={{
                display: "block",
                margin: "0.5rem 0",
                opacity: answered ? 0.5 : 1,
                pointerEvents: answered ? "none" : "auto",
                cursor: answered ? "not-allowed" : "pointer"
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {answered && round <= totalRounds && (
        <div style={{ marginTop: "2rem" }}>
          {wasCorrect ? (
            <p style={{ color: "green" }}>✅ ¡Correcto!</p>
          ) : (
            <p style={{ color: "red" }}>
              ❌ Incorrecto.
              {/* La respuesta era: <strong>{currentQuestion.answer}</strong> */}
            </p>
          )}

          {nickname === creator && (
            <button onClick={handleNextRound} style={{ marginTop: "1rem" }}>
              👉 Siguiente Ronda
            </button>
          )}
        </div>
      )}

      {round > totalRounds && (
        <div style={{ marginTop: "2rem" }}>
          <h2>🏆 Resultados Finales</h2>
          {score && Object.keys(score).length > 0 ? (
            <ul>
              
              {Object.entries(score)
                .sort(([, a], [, b]) => b - a)
                .map(([name, pts], i) => (
                  <li key={i}>
                    {i + 1}. {name} — {pts} punto{pts !== 1 ? "s" : ""}
                  </li>
                ))}
            </ul>
          ) : (
            <p>No hay puntuaciones registradas.</p>
          )}
          {nickname === creator && (
  <button onClick={handleRestartGame} style={{ marginTop: "1rem" }}>
    🔄 Repetir partida
  </button>
)}
        </div>
      )}
    </div>
  );
}