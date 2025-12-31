
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
}

export interface QuizHistoryItem {
  id: string;
  topic: string;
  score: number;
  total: number;
  date: string;
}

export enum AppSection {
  HOME = 'home',
  CONCEPTS = 'concepts',
  QUIZ = 'quiz',
  AI_EXPLORER = 'ai_explorer'
}

export interface ITILConcept {
  title: string;
  description: string;
  keyPoints: string[];
  icon: string;
}
