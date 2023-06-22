import { UnknownRecord } from './../../types/unknown-record.type';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { fillDTO } from '../../core/helpers/index.js';
import FilmRdo from './rdo/film.rdo.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import CreateFilmDto from './dto/create-film.dto.js';
import { RequestQuery } from '../../types/request-query.type.js';
import { FilmGenre } from '../../types/film-genre.enum.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentRdo from '../comment/rdo/comment.rdo.js';
import { ValidateObjectIdMiddleware } from '../../core/middlewares/validate-objectid.middleware.js';
import { UploadFileMiddleware } from './../../core/middlewares/upload-file.middleware.js';
import { ValidateDtoMiddleware } from '../../core/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../core/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../core/middlewares/private-route.middleware.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { NUMBER_PROMO_FILM } from './film.constant.js';
import UploadPosterImageRdo from './rdo/upload-poster-image.rdo.js';
import UploadBackgroundImageRdo from './rdo/upload-background-image.rdo.js';

type ParamsGetFilm = {
  filmId: string;
  genre: FilmGenre;
}

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({path: '/',method: HttpMethod.Get, handler: this.index});

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFilmDto)
      ]
    });

    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });

    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });

    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new ValidateDtoMiddleware(UpdateFilmDto),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });

    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.promo});

    this.addRoute({path: '/genre', method: HttpMethod.Get, handler: this.getFilmsFromGenre});

    this.addRoute({
      path: '/:filmId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });

    this.addRoute({
      path: '/:filmId/posterImage',
      method: HttpMethod.Post,
      handler: this.uploadPosterImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'posterImage'),
      ]
    });

    this.addRoute({
      path: '/:filmId/backgroundImage',
      method: HttpMethod.Post,
      handler: this.uploadBackgroundImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'posterImage'),
      ]
    });

    this.addRoute({
      path: '/favorite/:filmId/:status([0-1]{1})',
      method: HttpMethod.Post,
      handler: this.updateFavoriteFilms,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });

    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.findFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
  }

  public async index(_req: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const films = await this.filmService.find(_req.query.limit);
    const filmsToResponse = fillDTO(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async create({ body, user }: Request<UnknownRecord, UnknownRecord, CreateFilmDto>,
    res: Response): Promise<void> {
    const result = await this.filmService.create({...body, user: user.id});
    const film = await this.filmService.findById(result.id);
    this.created(res, fillDTO(FilmRdo, film));
  }

  public async show({params}: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response): Promise<void> {
    const {filmId} = params;
    const film = await this.filmService.findById(filmId);

    this.ok(res, fillDTO(FilmRdo, film));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response): Promise<void> {
    const {filmId} = params;
    const film = await this.filmService.deleteById(filmId);

    await this.commentService.deleteByFilmId(filmId);

    this.noContent(res, film);
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>,
    UpdateFilmDto>, res: Response
  ): Promise<void> {
    const updateFilm = await this.filmService.updateById(params.filmId, body);

    this.ok(res, fillDTO(FilmRdo, updateFilm));
  }

  public async promo(_req: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const films = await this.filmService.find(NUMBER_PROMO_FILM);
    const filmsToResponse = fillDTO(FilmRdo, films);

    this.ok(res, filmsToResponse);
  }

  public async getFilmsFromGenre(
    {params, query}: Request<core.ParamsDictionary | ParamsGetFilm, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const {genre} = params;
    const films = await this.filmService.findByGenre(genre, query.limit);

    this.ok(res, fillDTO(FilmRdo, films));
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByFilmId(params.filmId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async uploadPosterImage(req: Request<core.ParamsDictionary | ParamsGetFilm, object, object>,
    res: Response
  ): Promise<void> {
    const {filmId} = req.params;
    const updateDto = { posterImage: req.file?.filename };
    await this.filmService.updateById(filmId, updateDto);
    this.created(res, fillDTO(UploadPosterImageRdo, updateDto));
  }

  public async uploadBackgroundImage(req: Request<core.ParamsDictionary | ParamsGetFilm, object, object>,
    res: Response
  ): Promise<void> {
    const {filmId} = req.params;
    const updateDto = { backgroundImage: req.file?.filename };
    await this.filmService.updateById(filmId, updateDto);
    this.created(res, fillDTO(UploadBackgroundImageRdo, updateDto));
  }

  public async updateFavoriteFilms(_req: Request, _res: Response): Promise<void> {
    const {filmId, status} = _req.params;
    const user = _req.user.id;
    const film = await this.filmService.updateFavoriteFilms(user, filmId, status);
    const filmsToResponse = fillDTO(FilmRdo, film);

    if (Number(status) === 0) {
      this.noContent(_res, filmsToResponse);
    } else {
      this.ok(_res, filmsToResponse);
    }
  }

  public async findFavorites(_req: Request, _res: Response): Promise<void> {
    const user = _req.user.id;
    const films = await this.filmService.findFavorites(user);
    const filmsToResponse = fillDTO(FilmRdo, films);

    this.ok(_res, filmsToResponse);
  }
}
