import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { FilmGenre } from '../../types/film-genre.enum.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface FilmEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true, minlength: 2, maxlength: 100})
  public title!: string;

  @prop({required: true, minlength: 20, maxlength: 1024})
  public description!: string;

  @prop({required: true, default: new Date()})
  public datePublication!: Date;

  @prop({
    required: true,
    type: () => String,
    enum: FilmGenre
  })
  public genre!: FilmGenre;

  @prop({required: true})
  public released!: number;

  @prop({required: true, default: 0})
  public rating!: number;

  @prop({required: true, trim: true})
  public previewVideoLink!: string;

  @prop({required: true, trim: true})
  public videoLink!: string;

  @prop({
    required: true,
    default: [],
    type: () => String,
  })
  public starring!: string[];

  @prop({required: true, minlength: 2, maxlength: 50})
  public director!: string;

  @prop({required: true})
  public runTime!: number;

  @prop({default: 0})
  public countComments!: number;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public user!: Ref<UserEntity>;

  @prop({required: true, trim: true})
  public posterImage!: string;

  @prop({required: true, trim: true})
  public backgroundImage!: string;

  @prop({required: true, trim: true})
  public backgroundColor!: string;
}

export const FilmModel = getModelForClass(FilmEntity);

