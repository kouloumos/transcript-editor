export type DigitalPaperEditWord = {
  id: number;
  start: number;
  end: number;
  text: string;
};

export type DigitalPaperEditParagraph = {
  id: number;
  start: number;
  end: number;
  speaker: string;
};

export type DigitalPaperEditFormat = {
  words: DigitalPaperEditWord[];
  paragraphs: DigitalPaperEditParagraph[];
};

export type SlateNode = {
  children: { text: string; words: DigitalPaperEditWord[] };
  speaker: string;
  start: number;
  startTimecode: string;
  previousTimings: string;
  type: string;
  chapter?: string;
};
