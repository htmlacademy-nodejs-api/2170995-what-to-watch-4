import { Length, MaxLength, IsDateString, IsArray, IsEnum, IsInt, IsString, IsMongoId, IsHexColor, IsOptional } from 'class-validator';
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

  @IsMongoId({message: 'user field must be valid an id'})
  public user!: string;

  @IsString({message: 'poster image is required'})
  @MaxLength(256, {message: 'Too short for field poster image'})
  public posterImage!: string;

  @IsString({message: 'background image is required'})
  @MaxLength(256, {message: 'Too short for field background image'})
  public backgroundImage!: string;

  @IsHexColor({message: 'the background color should be in hexadecimal format'})
  public backgroundColor!: string;
}
