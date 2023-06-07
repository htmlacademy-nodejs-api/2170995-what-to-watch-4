import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { FilmServiceInterface } from './film-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import FilmService from './film.service.js';
import { FilmEntity, FilmModel } from './film.entity.js';
import { ControllerInterface } from '../../core/controller/controller.interface.js';
import FilmController from './film.controller.js';

export function createFilmContainer() {
  const filmContainer = new Container();
  filmContainer.bind<FilmServiceInterface>(AppComponent.FilmServiceInterface).to(FilmService);
  filmContainer.bind<types.ModelType<FilmEntity>>(AppComponent.FilmModel).toConstantValue(FilmModel);
  filmContainer.bind<ControllerInterface>(AppComponent.FilmController).to(FilmController).inSingletonScope();

  return filmContainer;
}
