import { DocumentType, types } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { FilmEntity } from './film.entity.js';
import { UserEntity } from './../user/user.entity';
import { SortType } from '../../types/sort-type.enum.js';
import { DEFAULT_FILM_COUNT, RATING_NUMBER } from './film.constant.js';
import UpdateFilmDto from './dto/update-film.dto.js';

const ObjectId = mongoose.Types.ObjectId;

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>,
    @inject(AppComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>
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
      .find({}, {}, {limit})
      .populate(['user'])
      .exec();
  }

  public async deleteByFilmId(filmId: string): Promise<number> {
    const result = await this.filmModel
      .deleteMany({filmId})
      .exec();

    return result.deletedCount;
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

  public async findByFilmTitle(filmTitle: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findOne({title: filmTitle})
      .populate(['user'])
      .exec();
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findById(filmId)
      .populate(['user'])
      .exec();
  }

  public async findFavoriteFilms(user: string): Promise<DocumentType<FilmEntity>[] | null> {
    const userId = await this.userModel.findById(user);

    if(!userId) {
      return null;
    }

    const favoriteFilms = userId.favoriteFilms;

    return this.filmModel
      .find({ _id: favoriteFilms})
      .populate(['user'])
      .exec();
  }

  public async incCommentCount(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {'$inc': {
        countComments: 1,
      }}).exec();
  }

  public async calculateRating(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    const result = await this.filmModel
      .aggregate([
        { $match: { _id: new ObjectId(filmId) } },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'filmId',
            as: 'comments'
          },
        },
        {
          $group: {
            _id: '$_id',
            avgRating: { $max: {$avg: '$comments.rating'} }
          },
        },
      ])
      .exec();

    if (result.length === 0) {
      return null;
    }

    const rating = Number(result[0].avgRating).toFixed(RATING_NUMBER);
    return await this.filmModel.findByIdAndUpdate(filmId, {rating: rating}, {new: true}).exec();
  }

  public async exists(filmId: string): Promise<boolean> {
    return (await this.filmModel
      .exists({_id: filmId})) !== null;
  }
}
