import React, { useState } from 'react'
import './Quiz.css'
import QuizCore from '../core/QuizCore';
import QuizQuestion from '../core/QuizQuestion';

interface QuizState {
  currentQuestion: QuizQuestion | null;
  selectedAnswer: string | null;
  score: number;
}

const Quiz: React.FC = () => {
  const quizCore = new QuizCore();

  const [state, setState] = useState<QuizState>({
    currentQuestion: quizCore.getCurrentQuestion(),  // Initialize the current question.
    selectedAnswer: null,  // Initialize the selected answer.
    score: 0,  // Initialize the score.
  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({ ...prevState, selectedAnswer: option }));
  }

  const handleButtonClick = (): void => {
    const { selectedAnswer, currentQuestion } = state;
    if (selectedAnswer && currentQuestion) {
      quizCore.answerQuestion(selectedAnswer);
      if (quizCore.hasNextQuestion()) {
        quizCore.nextQuestion();
        setState((prevState) => ({
          ...prevState,
          currentQuestion: quizCore.getCurrentQuestion(),
          selectedAnswer: null,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          currentQuestion: null,
          selectedAnswer: null,
          score: quizCore.getScore(),
        }));
      }
    }
  };

  const { currentQuestion, selectedAnswer } = state;
  const buttonText =quizCore.hasNextQuestion() ?'Next Question':'Submit';

  if (!currentQuestion) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {quizCore.getScore()} out of {quizCore.getTotalQuestions()}</p>
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