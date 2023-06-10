import { Length, MaxLength, IsDateString, IsArray, IsEnum, IsInt, IsString, IsHexadecimal, IsOptional } from 'class-validator';
import { FilmGenre } from '../../../types/film-genre.enum.js';

export default class UpdateFilmDto {
  @IsOptional()
  @Length(2, 100, {message: 'Min length is 2, max is 100'})
  public title?: string;

  @IsOptional()
  @Length(20, 1024, {message: 'Min length is 20, max is 1024'})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'post date must be valid ISO date'})
  public datePublication?: Date;

  @IsOptional()
  @IsEnum(FilmGenre, {
    each: true,
    message: `type must be key of Genres: ${FilmGenre.toString()}`
  })
  public genre?: FilmGenre;

  @IsOptional()
  @IsInt({message: 'released must be an integer'})
  public released?: number;

  @IsOptional()
  @IsString({message: 'preview video link is required'})
  public previewVideoLink?: string;

  @IsOptional()
  @IsString({message: 'video link is required'})
  public videoLink?: string;

  @IsOptional()
  @IsArray({message: 'Field starring must be an array'})
  public starring?: string[];

  @IsOptional()
  @Length(2, 50, {message: 'Min length is 2, max is 50'})
  public director?: string;

  @IsOptional()
  @IsInt({message: 'run time must be an integer'})
  public runTime?: number;

  @IsOptional()
  @IsString({message: 'poster image is required'})
  @MaxLength(256, {message: 'Too short for field poster image'})
  public posterImage?: string;

  @IsOptional()
  @IsString({message: 'background image is required'})
  @MaxLength(256, {message: 'Too short for field background image'})
  public backgroundImage?: string;

  @IsOptional()
  @IsHexadecimal({message: 'the background color should be in hexadecimal format'})
  public backgroundColor?: string;
}
