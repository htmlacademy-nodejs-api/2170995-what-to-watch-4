import 'reflect-metadata';
import { Container } from 'inversify';
import { AppComponent } from './types/app-component.enum.js';
import RestApplication from './app/rest.js';
import { createRestApplicationContainer } from './app/rest.container.js';
import { createUserContainer } from './modules/user/user.container.js';
import { createFilmContainer } from './modules/film/film.container.js';


async function bootstrap() {
  const mainContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createFilmContainer(),
  );

  const application = mainContainer.get<RestApplication>(AppComponent.RestApplication);
  await application.init();
}

bootstrap();
