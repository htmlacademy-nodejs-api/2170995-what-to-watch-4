import { Request, Response } from 'express';
import { inject } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import * as core from 'express-serve-static-core';
import { Controller } from '../../core/controller/controller.abstract.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { FilmServiceInterface } from './../film/film-service.interface.js';
import HttpError from '../../core/errors/http-error.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../core/helpers/index.js';
import CommentRdo from './rdo/comment.rdo.js';
import { ValidateDtoMiddleware } from '../../core/middlewares/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../../core/middlewares/private-route.middleware.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { ConfigInterface } from '../../core/config/config.interface.js';

type ParamsFilmDetails = {
  filmId: string;
}


export default class CommentController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(AppComponent.ConfigInterface) configInterface: ConfigInterface<RestSchema>,
  ) {
    super(logger, configInterface);

    this.logger.info('Register routes for CommentController...');
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ],
    });
  }

  public async create(
    {params, body, user}: Request<core.ParamsDictionary | ParamsFilmDetails, Record<string, unknown>,
    CreateCommentDto>,
    res: Response
  ): Promise<void> {

    const {filmId} = params;

    if (!await this.filmService.exists(filmId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${filmId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(filmId, {...body, user: user.id});
    await this.filmService.incCommentCount(filmId);
    await this.filmService.calculateRating(filmId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
