export interface Coordiate {
  x: number;
  y: number;
}

export interface Annotation {
  pageNumber: number;
  text: string;
  coordinates?: Coordiate;
}
