import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import { FilmEntity } from '../film/film.entity.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public text!: string;

  @prop({ required: true })
  public rating!: number;

  @prop({
    ref: FilmEntity,
  })
  public filmId!: Ref<FilmEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public user!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);

