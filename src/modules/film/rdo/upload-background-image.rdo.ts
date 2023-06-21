import { Expose } from 'class-transformer';

export default class UploadBackgroundImageRdo {
  @Expose()
  public backgroundImage!: string;
}
