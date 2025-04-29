import { useNavigate, useParams } from "react-router-dom";
import { useTriviaStore } from "../store/store";
import { useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client';
import { questions } from "../mock/questions";
import { answers } from "../mock/answers";
import { getQuestions, updatePlayer } from "../services/api";

const Game = () => {
    const { roomId } = useParams()
    const { player, setPlayer } = useTriviaStore(state => state)
    const [questionIndex, setQuestionIndex] = useState(0)
    const [question, setQuestion] = useState({})
    const [currentAnswers, setCurrentAnswers] = useState([])
    const [isAnswered, setIsAnswered] = useState(false);
    const [fetchedQuestions, setFetchedQuestions] = useState([])
    const navigate = useNavigate()


    const handleNotReady = async () =>{
    console.log('player is not ready')
    await setPlayer({...player, isReady: false})
    socket.emit('playerNotReady', {roomId, playerId:  player.id})
    }

    const handleReady = async () =>{
    console.log('player is ready')
    await setPlayer({...player, isReady: true})
    socket.emit('playerIsReady', {roomId, playerId:  player.id})
    }

    const socketRef = useRef()
    if (!socketRef.current) {
        socketRef.current = io('http://localhost:3000')
    }
    const socket = socketRef.current;

    const handleAnswer = async (isCorrect) =>{
      if(isCorrect){
        await setPlayer({...player, score: player.score + 1})
        // await updatePlayer({playerId: player.id, player})
      }
      setIsAnswered(true)
    }

    const handleNext = async () =>{
      setIsAnswered(false)
      setQuestionIndex(prev => prev + 1)
    }

    const roomQuestions = async () => {
      const allQuestions = await getQuestions(roomId)
       setFetchedQuestions(allQuestions)
    }
  useEffect(() => {
    socket.on('connect', () => {
      console.log('question page connected');

      socket.on('allPlayersReady', async () => {
        await handleNotReady();
        navigate(`/end/${roomId}`);
      });

      socket.emit('playerJoins', roomId)
    });
    
    roomQuestions()

    return () => {
      socket.off('allPlayersReady'); // Clean up listener
    };
  }, [])

  useEffect(() => {
    console.log("All answers: ", answers)
    const currentQuestion = questions[questionIndex]
    setQuestion(currentQuestion)
    const currentAnswers = answers.filter(answer => answer.questionId === currentQuestion.id)
    setCurrentAnswers(currentAnswers)
  }, [questionIndex])
  useEffect(() => {
    console.log('Current question: ', question)
    console.log('Current answers: ', currentAnswers)
    
  }, [currentAnswers, question])
  
  
    return (
        <div className="p-2 flex flex-col gap-5 items-center justify-center min-h-screen bg-gradient-to-r from-amber-300 to-orange-500/70 text-white">
            <h1 className="text-4xl">Trivia Party</h1>
            <div className="w-full max-w-4xl bg-white text-black rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">Pregunta</h2>
                <p className="text-lg mb-6 text-center">{question.question_text} id: {question.id}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                    { // fetchedQuestions.length>0
                        currentAnswers.length>0 && currentAnswers.map((answer, index) => {
                            return(
                              <button
                              key={index}
                              onClick={() => handleAnswer(answer.is_correct)}
                              disabled={isAnswered}
                              className={` py-2 px-4 rounded ${
                                isAnswered
                                  ? answer.is_correct
                                    ? "bg-emerald-500"
                                    : "bg-rose-500"
                                  : "bg-blue-500 hover:bg-blue-700"
                              } text-white`}
                            >
                                    {answer.answer_text}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
            <p className="text-4xl">Your score: {player.score}</p>
            { isAnswered &&
              <button onClick={handleNext} className='border-2 border-amber-900 px-8 py-2 text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded' >
                Siguiente
              </button>
            }
        </div>
    );
};

export default Game;