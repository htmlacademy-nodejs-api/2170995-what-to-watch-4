import CreateUserDto from '../dto/user/create-user.dto';
import { NewUser } from '../types/new-user';
import { NewFilm } from '../types/new-film';
import { NewReview } from '../types/new-review';
import CreateFilmDto from '../dto/film/create-film.dto';
import CreateCommentDto from '../dto/comment/create-comment.dto';

export const adaptUserToServer =
  (user: NewUser): CreateUserDto => ({
    name: user.name,
    email: user.email,
    password: user.password,
  });

export const adaptFilmToServer =
  (film: NewFilm): CreateFilmDto => ({
    ...film, genre: [film.genre]
  });

export const adaptCommentToServer =
  (comment: NewReview, filmId: string): CreateCommentDto => ({
    ...comment, filmId: filmId
  });
