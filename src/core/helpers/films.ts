import { Film } from '../../types/film.type.js';

export function createFilm(filmData: string): Film {
  const [
    title,
    description,
    createDate,
    genre,
    released,
    rating,
    previewVideoLink,
    videoLink,
    starring,
    director,
    runTime,
    countComments,
    name,
    email,
    avatar,
    posterImage,
    backgroundImage,
    backgroundColor,
  ] = filmData.replace('\n', '').split('\t');

  const user = {
    name,
    email,
    avatar,
  };

  return {
    title,
    description,
    datePublication: new Date(createDate),
    genre,
    released: Number.parseInt(released, 10),
    rating: Number.parseInt(rating, 10),
    previewVideoLink,
    videoLink,
    starring: starring.split(','),
    director,
    runTime: Number.parseInt(runTime, 10),
    countComments: Number.parseInt(countComments, 10),
    user,
    posterImage,
    backgroundImage,
    backgroundColor
  } as Film;
}
