import { DocumentType, types } from '@typegoose/typegoose';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { FilmEntity } from './film.entity.js';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>,
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New user created ${dto.title}`);

    return result;
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findById(filmId).exec();
  }
}
