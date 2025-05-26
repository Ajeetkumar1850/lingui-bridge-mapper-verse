
export interface WordMapping {
  id: string;
  english: string;
  hindi: string;
  kannada: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  usageExample?: string;
  synonyms?: {
    hindi?: string[];
    kannada?: string[];
  };
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'flashcard';
  question: string;
  options?: string[];
  correct: string;
  language: 'hindi' | 'kannada';
}

export type ViewMode = 'hindi' | 'kannada' | 'both';
export type QuizMode = 'multiple-choice' | 'flashcard' | 'true-false';
