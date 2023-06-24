import { DocumentType } from '@typegoose/typegoose';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmEntity } from './film.entity.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { DocumentExistsInterface } from '../../core/middlewares/document-exists.interface.js';

export interface FilmServiceInterface extends DocumentExistsInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findByFilmTitle(filmTitle: string): Promise<DocumentType<FilmEntity> | null>;
  deleteByFilmId(filmId: string): Promise<number | null>;
  updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  deleteById(filmId: string): Promise<DocumentType<FilmEntity>| null>;
  find(count?: number): Promise<DocumentType<FilmEntity>[]>;
  findByGenre(genre: string, count?: number): Promise<DocumentType<FilmEntity>[] | null>;
  findById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  findFavoriteFilms(user: string): Promise<DocumentType<FilmEntity>[] | null>;
  incCommentCount(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  calculateRating(filmId: string): Promise<DocumentType<FilmEntity> | null>;
}
