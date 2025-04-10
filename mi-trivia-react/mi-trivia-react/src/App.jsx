import { useState } from 'react';
import './App.css';

const questions = [
  {
    question: "¿Cuál es la capital de Francia?",
    options: ["París", "Madrid", "Roma", "Berlín"],
    answer: "París",
  },
  {
    question: "¿Qué lenguaje se usa en React?",
    options: ["Python", "JavaScript", "Ruby", "C#"],
    answer: "JavaScript",
  },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const handleAnswer = (option) => {
    if (disabled) return;

    const correct = option === questions[current].answer;
    setSelected(option);
    setIsCorrect(correct);
    setDisabled(true);

    if (correct) {
      setScore(score + 1);
    }

    // Esperar 1 segundo y pasar a la siguiente
    setTimeout(() => {
      const next = current + 1;
      if (next < questions.length) {
        setCurrent(next);
        setSelected(null);
        setIsCorrect(null);
        setDisabled(false);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  const getButtonClass = (option) => {
    if (!selected) return '';
    if (option === questions[current].answer) return 'correct';
    if (option === selected) return 'incorrect';
    return '';
  };

  return (
    <div className="trivia-container">
      {finished ? (
        <>
          <h2>¡Juego terminado!</h2>
          <p>Puntaje: {score} de {questions.length}</p>
        </>
      ) : (
        <>
          <h3>{questions[current].question}</h3>
          {questions[current].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className={getButtonClass(option)}
              disabled={disabled}
            >
              {option}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
