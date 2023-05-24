import { UserInfo } from './user-info.type.js';
import { FilmGenre } from './film-genre.enum.js';

export type Film = {
  title: string;
  description: string;
  datePublication: Date;
  genre: FilmGenre;
  released: number;
  rating: number;
  previewVideoLink: string;
  videoLink: string;
  starring: string[];
  director: string;
  runTime: number;
  countComments: number;
  user: UserInfo;
  posterImage: string;
  backgroundImage: string;
  backgroundColor: string;
}
