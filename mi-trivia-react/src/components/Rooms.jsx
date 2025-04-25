import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, update, get, remove, off } from "firebase/database";

export default function Room() {
  const navigate = useNavigate();
  // Obtener el código de la sala desde la URL
  const { code } = useParams();
  // Obtener el nickname y avatar del localStorage
  const [nickname] = useState(localStorage.getItem("nickname"));
  // Si no hay nickname, redirigir a la página de inicio
  const [avatar] = useState(localStorage.getItem("avatar"));
  // Si no hay avatar, asignar un valor por defecto
  const [userId] = useState(`${nickname}-${Math.random().toString(36).substr(2, 5)}`);

  // Estado para manejar los jugadores
  const [players, setPlayers] = useState({});

  // Estado para manejar la cantidad máxima de jugadores
  const [maxPlayers, setMaxPlayers] = useState(0);

  // Estado para manejar si la sala está llena
  const [roomFull, setRoomFull] = useState(false);

  // Estado para manejar el creador de la sala,
  const [creator, setCreator] = useState(null);

  // Estado para manejar si el juego ha comenzado
  const [started, setStarted] = useState(false);

  // Estado para manejar la cantidad de preguntas por jugador
  const [questionsPerPlayer, setQuestionsPerPlayer] = useState(1);

  // Estado para manejar la pregunta actual
  const [question, setQuestion] = useState("");

  // Estado para manejar las opciones de respuesta
  const [options, setOptions] = useState(["", "", "", ""]);

  // Estado para manejar el índice correcto
  const [correctIndex, setCorrectIndex] = useState(null);

  // Estado para manejar la cantidad de preguntas enviadas
  const [submittedCount, setSubmittedCount] = useState(0);


  // Estado para manejar la pregunta actual
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Estado para manejar si se ha respondido
  const [answered, setAnswered] = useState(false);

  // Estado para manejar si fue correcta
  const [wasCorrect, setWasCorrect] = useState(null);

  // Estado para manejar la ronda actual
  const [round, setRound] = useState(0);

  // Estado para manejar la cantidad total de rondas
  const [totalRounds, setTotalRounds] = useState(0);

  // Estado para manejar el puntaje
  const [score, setScore] = useState({});

  // Estado para manejar el temporizador
  const [timer, setTimer] = useState(15);

  // Estado para manejar los jugadores que han respondido
  const [playersAnswered, setPlayersAnswered] = useState([]);


  // Efecto para obtener los datos de la sala desde Firebase
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


      // Si el creador de la sala es el mismo que el usuario actual, se permite enviar preguntas
     if (!alreadyInRoom && Object.keys(playersInRoom).length < data.maxPlayers) {
  await update(ref(db, `rooms/${code}/players/${userId}`), {
    nickname,
    avatar,
  });

  // Si el jugador no tiene puntaje, se inicializa a 0
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


  // Efecto para obtener la cantidad de preguntas enviadas por el jugador, y actualizar el estado
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


  // Efecto para verificar si el jugador ha respondido la pregunta actual
  // y actualizar el estado
  useEffect(() => {
    const checkAnswered = async () => {
      const snapshot = await get(ref(db, `rooms/${code}/answers/${round}/${nickname}`));
      setAnswered(snapshot.exists());
    };

    if (started && currentQuestion && round <= totalRounds) {
      checkAnswered();
    }
  }, [round, currentQuestion, nickname, code, started, totalRounds]);


  // Efecto para manejar el temporizador de respuesta
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


// Efecto para obtener los jugadores que han respondido la pregunta actual
useEffect(() => {
  if (!started || !round) return;

  const answersRef = ref(db, `rooms/${code}/answers/${round}`);
  const unsubscribe = onValue(answersRef, (snapshot) => {
    const data = snapshot.val() || {};
    setPlayersAnswered(Object.keys(data)); // nicknames que respondieron
  });

  return () => unsubscribe();
}, [code, round, started]);

// Manejar la salida de la sala
const handleLeaveRoom = async () => {
  try {
    const playerRef = ref(db, `rooms/${code}/players/${userId}`);
    const roomRef = ref(db, `rooms/${code}`);

    // 🔌 Detener suscripción
    off(roomRef);
    console.log("✅ Suscripción detenida");

    // 🧼 Eliminar al jugador
    await remove(playerRef);
    console.log("✅ Jugador eliminado:", userId);

    // 🔍 Verificamos si queda alguien
    const snapshot = await get(ref(db, `rooms/${code}/players`));
    const remainingPlayers = snapshot.val();
    console.log("🧾 Jugadores restantes:", remainingPlayers);

    if (!remainingPlayers || Object.keys(remainingPlayers).length === 0) {
      await remove(ref(db, `rooms/${code}`));
      console.log("🔥 Sala eliminada");
    }
      localStorage.removeItem("userId");
    navigate("/");
  } catch (error) {
    console.error("❌ Error al salir de la sala:", error);
  }
};




  // Manejar el cambio de opciones de respuesta
  // Esta función se llama cuando el usuario cambia una opción de respuesta
  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Manejar la respuesta del jugador
  // Esta función se llama cuando el jugador selecciona una respuesta
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

  // Si la respuesta es correcta, suma 1 al puntaje
  // Si la respuesta es incorrecta, no se suma nada
  await update(ref(db, `rooms/${code}/score`), {
    [nickname]: isCorrect ? prevScore + 1 : prevScore,
  });

  console.log(`${nickname} respondió ${selected}. Correcta: ${isCorrect}`);
};

  // Manejar el envío de preguntas
  // Esta función se llama cuando el jugador envía una pregunta
  const handleSubmitQuestion = async () => {
    if (!question.trim() || options.some((opt) => !opt.trim()) || correctIndex === null) return;

    const questionId = `${nickname}-${Date.now()}`;

    await update(ref(db, `rooms/${code}/questions/${questionId}`), {
      question,
      options,
      answer: options[correctIndex],
      author: userId,
    });

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(null);
    setSubmittedCount(submittedCount + 1);
  };


  // Manejar el inicio del juego
  // Esta función se llama cuando el creador de la sala inicia el juego
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

  // Manejar el avance a la siguiente ronda
  // Esta función se llama cuando el creador de la sala avanza a la siguiente ronda
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

  // Manejar el reinicio del juego
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

// Renderizar la interfaz de la sala
  return (
    <div className="trivia-container">
      <button className="button"  onClick={handleLeaveRoom} style={{ float: "left" }}>
  Salir de la sala ❌
</button><br />
      <h2>Sala: {code}</h2>
      <p>Jugadores conectados ({Object.keys(players).length} / {maxPlayers})</p>
      <ul>
  {Object.values(players).map((p, i) => (
    <li
      key={i}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px"
      }}
    >
      <img
        src={p.avatar}
        alt={p.nickname}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />
      <span style={{  fontSize: "1.1rem" }}>
        {p.nickname}
      </span>
    </li>
  ))}
</ul>

      
        {Object.keys(score).length > 0 && (
  <div >
    <p>Liderando:{" "}
    {
      Object.entries(score).sort(([, a], [, b]) => b - a)[0][0]
    } con {Object.entries(score).sort(([, a], [, b]) => b - a)[0][1]} punto(s)</p>
  </div>
  
)}


{playersAnswered.length > 0 && (
  <div style={{ marginTop: "1rem" }}>
    <h4>📥 Respuestas recibidas:</h4>
    <ul>
      {playersAnswered.map((name, i) => (
        <li key={i}>✅ {name} ha respondido</li>
      ))}
    </ul>
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

          <button className="button"  onClick={handleSubmitQuestion} style={{ marginTop: "1rem" }}>
            Enviar Pregunta
          </button>
        </div>
      )}

      {!started && roomFull && submittedCount >= questionsPerPlayer && (
        <p style={{ marginTop: "2rem" }}>✅ Has enviado todas tus preguntas.</p>
      )}

      {!started && nickname === creator && roomFull && (
        <button className="button"  onClick={handleStartGame} style={{ marginTop: "2rem" }}>
          🚀 Empezar Partida
        </button>
      )}

      {started && currentQuestion && !answered && round <= totalRounds && (
        <div style={{ marginTop: "2rem" }}>
          <p>⏱ Tiempo restante: {timer}s</p>
          <h3>❓ Pregunta (Ronda {round} de {totalRounds}):</h3>
          <p>{currentQuestion.question}</p>
          {currentQuestion.options.map((opt, idx) => (
            <button className="button" 
              key={idx}
              onClick={() => handleAnswer(opt)}
              disabled={answered || currentQuestion.author === userId}
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
          {currentQuestion.author === userId && (
  <p style={{ color: "gray", fontStyle: "italic" }}>
    No puedes responder tu propia pregunta.
  </p>
)}
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
            <button className="button"  onClick={handleNextRound} style={{ marginTop: "1rem" }}>
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
  <button className="button"   onClick={handleRestartGame} style={{ marginTop: "1rem" }}>
    🔄 Repetir partida
  </button>
)}
        </div>
      )}
    </div>
  );
}