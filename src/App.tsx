import React, { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { fetchQuizQuestions } from "./API";
//Types
import { Difficulty, QuestionState } from "./API";
//Styles
import {GlobalStyle, Wrapper} from './App.styles';

const TOTAL_QUESTİON = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App = () => {
  console.log(fetchQuizQuestions(TOTAL_QUESTİON, Difficulty.EASY));

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTravia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestion = await fetchQuizQuestions(
      TOTAL_QUESTİON,
      Difficulty.EASY
    );
    setQuestions(newQuestion);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //User Answer
      const answer = e.currentTarget.value;
      //Check answer againist correct answer
      const correct = questions[number].correct_answer === answer;
      //Add score if answer is correct
      if (correct) setScore((prev) => prev + 1);

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    //Move on to the next question if not the last question
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTİON) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
    <GlobalStyle />
         <Wrapper>
      <h1>REACT QUİZ</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTİON ? (
        <button className="start" onClick={startTravia}>
          Start
        </button>
      ) : null}
      {!gameOver ? <p className="score">Score: {score} </p> : null}
      {loading && <p>Loading Question...</p>}

      {!loading && !gameOver && (
        <QuestionCard
          questionNbr={number + 1}
          totalQuestion={TOTAL_QUESTİON}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {!loading &&
      !gameOver &&
      userAnswers.length === number + 1 &&
      number !== TOTAL_QUESTİON - 1 ? (
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
      ) : null}
    </Wrapper>
    </>
  );  
};

export default App;
