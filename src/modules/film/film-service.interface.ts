import { DocumentType } from '@typegoose/typegoose';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmEntity } from './film.entity.js';
import EditFilmDto from './dto/edit-film.dto.js';

export interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  editById(filmId: string, dto: EditFilmDto): Promise<DocumentType<FilmEntity> | null>;
  deleteById(filmId: string): Promise<DocumentType<FilmEntity>| null>;
  find(count?: number): Promise<DocumentType<FilmEntity>[]>;
  findByGenre(genreType: string, count?: number): Promise<DocumentType<FilmEntity>[]>;
  findById(filmId: string): Promise<DocumentType<FilmEntity>[] | null>;
  findPromo(): Promise<DocumentType<FilmEntity>[] | null>;
  findFavorites(): Promise<DocumentType<FilmEntity>[] | null>;
  editFavorite(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  incCommentCount(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  exists(filmId: string): Promise<boolean>;
}
