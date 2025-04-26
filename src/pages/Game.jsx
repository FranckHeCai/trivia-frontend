import { useNavigate, useParams } from "react-router-dom";
import { useTriviaStore } from "../store/store";
import { useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client';
import { questions } from "../mock/questions";
import { answers } from "../mock/answers";

const Game = () => {
    const { roomId } = useParams()
    const { player, setPlayer } = useTriviaStore(state => state)
    const [questionIndex, setQuestionIndex] = useState(0)
    const [question, setQuestion] = useState({})
    const [currentAnswers, setCurrentAnswers] = useState([])
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

  useEffect(() => {
    socket.on('connect', () => {
      console.log('question page connected');

      socket.on('allPlayersReady', async () => {
        await handleNotReady();
        navigate(`/end/${roomId}`);
      });

      socket.emit('playerJoins', roomId)
    });
    
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
                    {
                        currentAnswers.length>0 && currentAnswers.map(answer => {
                            return(
                                <button key={answer.id} className="bg-indigo-400 hover:bg-blue-700 cursor-pointer text-white p-3 sm:p-6 rounded">
                                    {answer.answer_text}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default Game;