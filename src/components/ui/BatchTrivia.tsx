import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle2, XCircle, Timer } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../../types';
import { cn } from '../../lib/utils';

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

interface BatchTriviaProps {
  users: UserProfile[];
  onComplete?: (score: number) => void;
}

export const BatchTrivia = ({ users, onComplete }: BatchTriviaProps) => {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(15);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (users.length < 5) return;

    const generatedQuestions: Question[] = [];
    for (let i = 0; i < 10; i++) {
      const type = Math.floor(Math.random() * 3);
      const targetUser = users[Math.floor(Math.random() * users.length)];
      const otherUsers = users.filter((u) => u.uid !== targetUser.uid);

      if (type === 0) {
        generatedQuestions.push({
          text: `Whose farewell quote is: "${targetUser.farewellQuote}"?`,
          options: shuffle([targetUser.name, ...getRandomNames(otherUsers, 3)]),
          correctAnswer: targetUser.name,
        });
      } else if (type === 1) {
        generatedQuestions.push({
          text: `Which branch does ${targetUser.name} belong to?`,
          options: shuffle([targetUser.branch, ...getRandomBranches(targetUser.branch, 3)]),
          correctAnswer: targetUser.branch,
        });
      } else {
        generatedQuestions.push({
          text: `Who is graduating from ${targetUser.college}?`,
          options: shuffle([targetUser.name, ...getRandomNames(otherUsers, 3)]),
          correctAnswer: targetUser.name,
        });
      }
    }
    setQuestions(generatedQuestions);
  }, [users]);

  React.useEffect(() => {
    if (isGameOver || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isGameOver, questions]);

  const handleAnswer = (option: string | null) => {
    if (selectedOption !== null) return;
    setSelectedOption(option || 'TIME_UP');

    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(15);
        setSelectedOption(null);
      } else {
        setIsGameOver(true);
        onComplete?.(score + (option === questions[currentQuestionIndex].correctAnswer ? 1 : 0));
      }
    }, 1500);
  };

  if (users.length < 5) {
    return (
      <Card className="p-8 text-center">
        <HelpCircle className="mx-auto mb-4 h-12 w-12 text-slate-300" />
        <h3 className="text-lg font-bold">Not Enough Data</h3>
        <p className="text-sm text-slate-500">Wait for more batchmates to join to play trivia!</p>
      </Card>
    );
  }

  if (isGameOver) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h3 className="text-2xl font-bold">Trivia Complete!</h3>
        <p className="mb-6 text-slate-500">Your final score: {score} / 10</p>
        <Button onClick={() => window.location.reload()}>Play Again</Button>
      </Card>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-slate-100">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 15) * 100}%` }}
          className="h-full bg-indigo-600"
        />
      </div>
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div>
          <CardTitle className="text-lg">Batch Trivia</CardTitle>
          <p className="text-xs text-slate-500">Question {currentQuestionIndex + 1} of 10</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
          <Timer className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-bold text-slate-900">{timeLeft}s</span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h4 className="mb-8 text-center text-xl font-bold text-slate-900">
          {currentQuestion.text}
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {currentQuestion.options.map((option) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = selectedOption === option;
            const showResult = selectedOption !== null;

            return (
              <button
                key={option}
                disabled={showResult}
                onClick={() => handleAnswer(option)}
                className={cn(
                  'flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold transition-all',
                  !showResult && 'border-slate-100 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50',
                  showResult && isCorrect && 'border-green-500 bg-green-50 text-green-700',
                  showResult && isSelected && !isCorrect && 'border-red-500 bg-red-50 text-red-700',
                  showResult && !isSelected && !isCorrect && 'border-slate-100 bg-slate-50 opacity-50'
                )}
              >
                <span>{option}</span>
                {showResult && isCorrect && <CheckCircle2 className="h-5 w-5" />}
                {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5" />}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function getRandomNames(users: UserProfile[], count: number): string[] {
  return shuffle(users.map((u) => u.name)).slice(0, count);
}

function getRandomBranches(exclude: string, count: number): string[] {
  const branches = [
    'Computer Science (CSE)',
    'Electronics (ECE)',
    'Electrical (EEE)',
    'Mechanical (ME)',
    'Civil (CE)',
    'Information Technology (IT)',
  ].filter((b) => b !== exclude);
  return shuffle(branches).slice(0, count);
}
