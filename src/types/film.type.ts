import { UserInfo } from './user-info.type';

export type Film = {
  title: string;
  description: string;
  datePublication: Date;
  genre: string;
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
