import { Expose } from 'class-transformer';

export default class UploadUserAvatarRdo {
  @Expose()
  public filepath!: string;
}
