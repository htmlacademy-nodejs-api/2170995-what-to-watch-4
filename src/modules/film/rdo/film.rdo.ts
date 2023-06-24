import { Expose, Type } from 'class-transformer';
import { FilmGenre } from '../../../types/film-genre.enum.js';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class FilmRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public datePublication!: Date;

  @Expose()
  public genre!: FilmGenre;

  @Expose()
  public released!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public starring!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public runTime!: number;

  @Expose()
  public countComments!: number;

  @Expose({ name: 'user' })
  @Type(() => UserRdo)
  public user!: UserRdo;

  @Expose()
  public posterImage!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;

  @Expose()
  public isFavorite!: boolean;
}
