export interface TarotCardData {
  id: number;
  name: string;
  nameEn: string;
  imageKeyword: string; // Used to fetch a thematic image
  meaningUp: string;
  meaningRev: string;
}

export interface SelectedCard extends TarotCardData {
  isReversed: boolean;
  position: 'past' | 'present' | 'future';
}

export type AppState = 'intro' | 'shuffling' | 'selecting' | 'revealing' | 'reading';

export interface ReadingResult {
  summary: string;
  details: {
    past: string;
    present: string;
    future: string;
  };
  advice: string;
}