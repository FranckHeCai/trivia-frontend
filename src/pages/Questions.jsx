import { useState } from "react";

const Questions = ({ onSubmit }) => {
  const [type, setType] = useState("multiple");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);

  const handleAnswerChange = (value, index) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const addAnswerField = () => {
    if (answers.length < 4) {
      setAnswers([...answers, ""]);
    }
  };

  const removeAnswerField = (index) => {
    if (answers.length > 2) {
      const updated = answers.filter((_, i) => i !== index);
      setAnswers(updated);
      // Adjust correct index if needed
      if (correctIndex === index) {
        setCorrectIndex(null);
      } else if (correctIndex > index) {
        setCorrectIndex(correctIndex - 1);
      }
    }
  };

  const handleSubmit = () => {
    const trimmedQuestion = question.trim();
    const filledAnswers = type === "multiple" ? answers.filter(a => a.trim()) : ["True", "False"];

    if (!trimmedQuestion || correctIndex === null || filledAnswers.length < 2) {
      return alert("Please complete all required fields and select the correct answer.");
    }

    const payload = {
      type,
      question: trimmedQuestion,
      answers: filledAnswers,
      correctAnswer: filledAnswers[correctIndex],
    };

    onSubmit?.(payload);
    resetForm();
  };

  const resetForm = () => {
    setType("multiple");
    setQuestion("");
    setAnswers(["", ""]);
    setCorrectIndex(null);
  };

  return (
    <div className="p-2 flex w-full h-screen items-center justify-center">
      <div className="p-5 w-full  sm:w-md rounded-xl shadow bg-white">
        <h2 className="text-xl font-bold text-center">Crea una pregunta</h2>
        <form className="flex flex-col gap-2" onSubmit={(event)=>{handleSubmit(event)}}>
          <label className="block">
            <span className="text-sm">Tipo de pregunta</span>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setCorrectIndex(null);
                setAnswers(e.target.value === "multiple" ? ["", ""] : []);
              }}
              className="w-full outline-2 outline-gray-300 focus:outline-amber-800 px-2 py-1 rounded mt-1"
            >
              <option value="multiple">Multiple opción</option>
              <option value="boolean">Verdadero / Falso</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Pregunta</span>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 bg-white outline-2 px-2 py-1 rounded focus:outline-amber-900 outline-gray-300"
              placeholder="Me gusta..."
            />
          </label>
          {type === "multiple" && (
            <div className="space-y-2">
              {answers.map((ans, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                  />
                  <input
                    type="text"
                    value={ans}
                    onChange={(e) => handleAnswerChange(e.target.value, idx)}
                    className="flex-1 bg-white outline-2 px-2 py-1 rounded focus:outline-amber-900 outline-gray-300"
                  
                    placeholder={`Respuesta ${String.fromCharCode(65 + idx)}`}
                  />
                  {answers.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeAnswerField(idx)}
                      className="text-red-500 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {answers.length < 4 && (
                <button
                  type="button"
                  onClick={addAnswerField}
                  className="text-sm text-amber-600 hover:underline"
                >
                  + Añadir
                </button>
              )}
            </div>
          )}
          {type === "boolean" && (
            <div className="space-y-2">
              {["True", "False"].map((ans, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                  />
                  <label>{ans}</label>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded cursor-pointer"
          >
            Confirmar pregunta
          </button>
        </form>
      </div>
    </div>
  );
};

export default Questions;
