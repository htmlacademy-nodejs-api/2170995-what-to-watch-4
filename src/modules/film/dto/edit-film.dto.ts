import { FilmGenre } from '../../../types/film-genre.enum.js';

export default class EditFilmDto {
  public title?: string;
  public description?: string;
  public datePublication?: Date;
  public genre?: FilmGenre;
  public released?: number;
  public rating?: number;
  public previewVideoLink?: string;
  public videoLink?: string;
  public starring?: string[];
  public director?: string;
  public runTime?: number;
  public countComments?: number;
  public posterImage?: string;
  public backgroundImage?: string;
  public backgroundColor?: string;
}
