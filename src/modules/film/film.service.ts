import { DocumentType, types } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { FilmEntity } from './film.entity.js';
import { SortType } from '../../types/sort-type.enum.js';
import { DEFAULT_FILM_COUNT } from './film.constant.js';
import UpdateFilmDto from './dto/update-film.dto.js';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>,
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created ${dto.title}`);

    return result;
  }

  public async updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, dto, {new: true})
      .populate(['user'])
      .exec();
  }

  public async deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .exec();
  }

  public async find(count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;

    return this.filmModel
      .find()
      .populate(['user'])
      .limit(limit)
      .exec();
  }

  public async findByGenre(genre: string, count?: number): Promise<DocumentType<FilmEntity>[] | null> {
    const limit = count ?? DEFAULT_FILM_COUNT;

    return this.filmModel
      .find({genre: { $all : [genre] }}, {}, {limit})
      .sort({datePublication: SortType.Down})
      .limit(limit)
      .populate(['user'])
      .exec();
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity>[] | null> {
    return this.filmModel
      .aggregate([
        {
          $match: {'_id': new mongoose.Types.ObjectId(filmId)},
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'filmId',
            as: 'commentData'
          }
        },
        {
          $set:
          {rating: {$avg: '$commentData.rating'}, comments: { $size: '$commentData'}}
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $unset: 'user._id'
        },
      ]);
  }

  public async findFavorites(user: string): Promise<DocumentType<FilmEntity>[] | null> {
    return this.filmModel
      .find({ favorite: user})
      .populate(['user'])
      .exec();
  }

  public async incCommentCount(filmId: string): Promise<DocumentType<FilmEntity > | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async updateFavoriteFilms(user:string, filmId:string, status:string
  ): Promise<DocumentType<FilmEntity> | null> {
    if(Number(status) !== 0){
      return this.filmModel
        .findByIdAndUpdate(filmId, {'$addToSet': {
          favorite: user,
        }})
        .populate(['user'])
        .exec();
    }
    return this.filmModel
      .findByIdAndUpdate(filmId, {'$pull': {favorite: user}})
      .exec();
  }

  public async exists(filmId: string): Promise<boolean> {
    return (await this.filmModel
      .exists({_id: filmId})) !== null;
  }
}
