
import { WordMapping } from '@/types';

export const initialWordMappings: WordMapping[] = [
  {
    id: '1',
    english: 'book',
    hindi: 'किताब',
    kannada: 'ಪುಸ್ತಕ',
    partOfSpeech: 'noun',
    usageExample: 'I am reading a book.',
    synonyms: {
      hindi: ['पुस्तक', 'ग्रंथ'],
      kannada: ['ಗ್ರಂಥ']
    }
  },
  {
    id: '2',
    english: 'water',
    hindi: 'पानी',
    kannada: 'ನೀರು',
    partOfSpeech: 'noun',
    usageExample: 'I drink water daily.',
    synonyms: {
      hindi: ['जल'],
      kannada: ['ಜಲ']
    }
  },
  {
    id: '3',
    english: 'run',
    hindi: 'दौड़ना',
    kannada: 'ಓಡು',
    partOfSpeech: 'verb',
    usageExample: 'I run every morning.',
    synonyms: {
      hindi: ['भागना'],
      kannada: ['ಓಟ']
    }
  },
  {
    id: '4',
    english: 'beautiful',
    hindi: 'सुंदर',
    kannada: 'ಸುಂದರ',
    partOfSpeech: 'adjective',
    usageExample: 'The flower is beautiful.',
    synonyms: {
      hindi: ['खूबसूरत', 'मनोहर'],
      kannada: ['ಚೆಲುವಿನ']
    }
  },
  {
    id: '5',
    english: 'good morning',
    hindi: 'शुभ प्रभात',
    kannada: 'ಶುಭೋದಯ',
    partOfSpeech: 'phrase',
    usageExample: 'Good morning, how are you?',
  },
  {
    id: '6',
    english: 'house',
    hindi: 'घर',
    kannada: 'ಮನೆ',
    partOfSpeech: 'noun',
    usageExample: 'This is my house.',
    synonyms: {
      hindi: ['मकान', 'आवास'],
      kannada: ['ಗೃಹ']
    }
  },
  {
    id: '7',
    english: 'eat',
    hindi: 'खाना',
    kannada: 'ತಿನ್ನು',
    partOfSpeech: 'verb',
    usageExample: 'I eat rice for lunch.',
    synonyms: {
      hindi: ['भोजन करना'],
      kannada: ['ಊಟ ಮಾಡು']
    }
  },
  {
    id: '8',
    english: 'love',
    hindi: 'प्यार',
    kannada: 'ಪ್ರೀತಿ',
    partOfSpeech: 'noun',
    usageExample: 'Love is beautiful.',
    synonyms: {
      hindi: ['प्रेम', 'मोहब्बत'],
      kannada: ['ಪ್ರೇಮ']
    }
  }
];
