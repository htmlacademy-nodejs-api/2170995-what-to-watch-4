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
  @prop({ required: true, minlength: 1, maxlength: 15, default: '' })
  public name: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatar: string;

  @prop({ required: true, minlength: 6, default: '' })
  private password?: string;

  constructor(userData: UserInfo) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
