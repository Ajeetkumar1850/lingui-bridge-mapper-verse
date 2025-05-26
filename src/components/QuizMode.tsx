
import React, { useState, useEffect } from 'react';
import { WordMapping, QuizQuestion } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface QuizModeProps {
  wordMappings: WordMapping[];
}

export const QuizMode: React.FC<QuizModeProps> = ({ wordMappings }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [language, setLanguage] = useState<'hindi' | 'kannada'>('hindi');

  const generateQuizQuestions = () => {
    if (wordMappings.length < 4) {
      toast.error('Need at least 4 words to generate quiz');
      return;
    }

    const shuffled = [...wordMappings].sort(() => Math.random() - 0.5);
    const questions: QuizQuestion[] = shuffled.slice(0, Math.min(10, wordMappings.length)).map((mapping, index) => {
      const correctAnswer = language === 'hindi' ? mapping.hindi : mapping.kannada;
      
      // Get 3 wrong answers
      const wrongAnswers = wordMappings
        .filter(m => m.id !== mapping.id)
        .map(m => language === 'hindi' ? m.hindi : m.kannada)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        id: index.toString(),
        type: 'multiple-choice' as const,
        question: `What is the ${language} translation for "${mapping.english}"?`,
        options,
        correct: correctAnswer,
        language
      };
    });

    setQuizQuestions(questions);
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
    setShowResult(false);
    setSelectedAnswer('');
  };

  useEffect(() => {
    generateQuizQuestions();
  }, [wordMappings, language]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === quizQuestions[currentQuestion].correct) {
      setScore(prev => prev + 1);
      toast.success('Correct!');
    } else {
      toast.error(`Incorrect! The answer was: ${quizQuestions[currentQuestion].correct}`);
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setShowResult(false);
        setSelectedAnswer('');
      } else {
        setQuizComplete(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    generateQuizQuestions();
  };

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (quizQuestions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500 mb-4">Not enough words to generate quiz. Add more words to the dictionary.</p>
          <Button onClick={generateQuizQuestions}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (quizComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Quiz Complete!</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className={`text-4xl font-bold ${getScoreColor()}`}>
            {score}/{quizQuestions.length}
          </div>
          <div className="text-lg text-gray-600">
            {(score / quizQuestions.length) * 100}% Correct
          </div>
          <Progress value={(score / quizQuestions.length) * 100} className="w-full" />
          <div className="flex justify-center space-x-4">
            <Button onClick={resetQuiz} className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setLanguage(language === 'hindi' ? 'kannada' : 'hindi')}
            >
              Switch to {language === 'hindi' ? 'Kannada' : 'Hindi'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </Badge>
            <Badge variant="secondary" className={language === 'hindi' ? 'bg-orange-100' : 'bg-red-100'}>
              {language === 'hindi' ? 'Hindi Quiz' : 'Kannada Quiz'}
            </Badge>
          </div>
          <Progress 
            value={((currentQuestion + 1) / quizQuestions.length) * 100} 
            className="w-full mb-4" 
          />
          <div className="text-right text-sm text-gray-600">
            Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options?.map((option, index) => {
            let buttonVariant: "outline" | "default" | "destructive" | "secondary" = "outline";
            let buttonClass = "";

            if (showResult) {
              if (option === question.correct) {
                buttonVariant = "default";
                buttonClass = "bg-green-500 hover:bg-green-600 text-white";
              } else if (option === selectedAnswer && option !== question.correct) {
                buttonVariant = "destructive";
              } else {
                buttonClass = "opacity-50";
              }
            }

            return (
              <Button
                key={index}
                variant={buttonVariant}
                className={`w-full text-left justify-start h-auto py-3 ${buttonClass}`}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-lg">{option}</span>
                  {showResult && option === question.correct && (
                    <CheckCircle className="w-5 h-5 ml-auto" />
                  )}
                  {showResult && option === selectedAnswer && option !== question.correct && (
                    <XCircle className="w-5 h-5 ml-auto" />
                  )}
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Language Switch */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setLanguage(language === 'hindi' ? 'kannada' : 'hindi')}
          disabled={showResult}
        >
          Switch to {language === 'hindi' ? 'Kannada' : 'Hindi'} Quiz
        </Button>
      </div>
    </div>
  );
};
