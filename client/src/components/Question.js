import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {v4} from "uuid";

const URL = "http://localhost:8080";

const Question = ({setFinished, socket, opponentFinished, finished, room, username, myScore, setMyScore}) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        fetch("https://trivia.willfry.co.uk/api/questions?categories=geography&limit=10").then(res => res.json()).then(res => {
            let questionsToAdd = [];
            for (let e of res) {
                const answerOptions = [];
                e.incorrectAnswers.slice(0, 3).forEach(answerText => {
                    answerOptions.push({
                        answerText: answerText, isCorrect: false
                    })
                });
                answerOptions.push({
                    answerText: e.correctAnswer, isCorrect: true
                });
                shuffle(answerOptions);
                questionsToAdd.push({
                    questionText: e.question,
                    answerOptions
                })
            }
            setQuestions([...questionsToAdd]);
        }).catch(console.log);
    }, []);


    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }


    const handleAnswerOptionClick = async (isCorrect) => {
        if (isCorrect) {
            setMyScore(myScore + 1);
            socket.emit('update-score', {username, addedScore: 1, room});
        }
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setFinished(true);
            socket.emit('finish-attempt', true);
        }
    };
    const backToHome = () => {
        socket.emit('leave-room', {});
        fetch(`/points`, {
            body: JSON.stringify({username, point: myScore}),
            method: 'PUT',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }

        }).then(() => {
            console.log("Score of this match is recorded")
        });


    }
    console.log(questions);
    return (
        <>
            <div className="question-container">
                {(opponentFinished || finished) ? <div className="game-over-container">
                        <div>Game over. {opponentFinished && "(Opponent has finished)"}</div>
                        <Link to="/rooms">
                            <button onClick={backToHome} className="back-to-home-button">Save & Back to home</button>
                        </Link>

                    </div> :
                    <div className='app'>

                        {!questions.length ? <div className="question-section">Getting questions....</div> : <>
                            <div className='question-section'>
                                <div className='question-count'>
                                    <span>Question {currentQuestion + 1}</span>/{questions.length}
                                </div>
                                <div className='question-text'>{questions[currentQuestion].questionText}</div>
                            </div>
                            <div className='answer-section'>
                                {questions && questions[currentQuestion].answerOptions.map((answerOption) => (
                                    <button key={v4()}
                                            onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}>{answerOption.answerText}</button>
                                ))}
                            </div>
                        </>}

                    </div>}

            </div>
        </>
    );
}

export default Question;