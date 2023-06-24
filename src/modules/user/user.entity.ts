import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import { UserInfo } from '../../types/user-info.type.js';
import { createSHA256 } from '../../core/helpers/index.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements UserInfo {
  @prop({ required: true, default: '' })
  public name: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatar: string;

  @prop({ required: true, default: '' })
  private password?: string;

  @prop({ default: [] })
  public favoriteFilms: string[];

  constructor(userData: UserInfo) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
    this.favoriteFilms = userData.favoriteFilms;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
