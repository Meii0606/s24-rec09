import React, { useState } from 'react'
import './Quiz.css'
import QuizCore from '../core/QuizCore';
import QuizQuestion from '../core/QuizQuestion';

interface QuizState {
  quizCore: QuizCore;
  currentQuestion: QuizQuestion | null;
  selectedAnswer: string | null;
  score: number;
}

const Quiz: React.FC = () => {
  const quizCore = new QuizCore();
  const [state, setState] = useState<QuizState>({
    quizCore: quizCore,
    currentQuestion: quizCore.getCurrentQuestion(),  // Initialize the current question.
    selectedAnswer: null,  // Initialize the selected answer.
    score: 0,  // Initialize the score.

  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({ ...prevState, selectedAnswer: option }));
  }

  const handleButtonClick = (): void => {
    if (!state.currentQuestion) {
      setState((prevState) => ({ ...prevState, currentQuestion: state.quizCore.getCurrentQuestion() }));
    }
    if (state.selectedAnswer && state.currentQuestion) {
      console.log('currentQuestion', state.currentQuestion.question);
      state.quizCore.answerQuestion(state.selectedAnswer);
      if (state.quizCore.hasNextQuestion()) {
        state.quizCore.nextQuestion();
        setState((prevState) => ({
          ...prevState,
          currentQuestion: state.quizCore.getCurrentQuestion(),
          selectedAnswer: null,
        }));
        console.log('next_currentQuestion', state.currentQuestion.question);
      } else {
        setState((prevState) => ({
          ...prevState,
          currentQuestion: null,
          selectedAnswer: null,
          score: state.quizCore.getScore(),
        }));
      }
    }
  };

  const { currentQuestion, selectedAnswer } = state;
  const buttonText =state.quizCore.hasNextQuestion() ?'Next Question':'Submit';

  if (!currentQuestion) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {state.quizCore.getScore()} out of {state.quizCore.getTotalQuestions()}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion.question}</p>
    
      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={selectedAnswer === option ? 'selected' : ''}
          >
            {option}
          </li>
        ))}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? 'No answer selected'}</p>

      <button onClick={handleButtonClick}>{buttonText}</button>
    </div>
  );
};

export default Quiz;