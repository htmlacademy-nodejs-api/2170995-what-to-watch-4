import { Length, IsDateString, IsArray, IsEnum, IsInt, IsString, IsHexColor, IsOptional } from 'class-validator';
import { FilmGenre } from '../../../types/film-genre.enum.js';

export default class CreateFilmDto {
  @Length(2, 100, {message: 'Min length is 2, max is 100'})
  public title!: string;

  @Length(20, 1024, {message: 'Min length is 20, max is 1024'})
  public description!: string;

  @IsOptional()
  @IsDateString({}, {
    message: 'post date must be valid ISO date'
  })
  public datePublication!: Date;

  @IsEnum(FilmGenre, {
    each: true,
    message: `type must be key of Genres: ${FilmGenre.toString()}`
  })
  public genre!: FilmGenre;

  @IsInt({message: 'released must be an integer'})
  public released!: number;

  @IsString({message: 'preview video link is required'})
  public previewVideoLink!: string;

  @IsString({message: 'video link is required'})
  public videoLink!: string;

  @IsArray({message: 'Field starring must be an array'})
  public starring!: string[];

  @Length(2, 50, {message: 'Min length is 2, max is 50'})
  public director!: string;

  @IsInt({message: 'run time must be an integer'})
  public runTime!: number;

  public user!: string;

  @IsHexColor({message: 'the background color should be in hexadecimal format'})
  public backgroundColor!: string;
}
