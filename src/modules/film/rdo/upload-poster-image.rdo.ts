import { Expose } from 'class-transformer';

export default class UploadPosterImageRdo {
  @Expose()
  public posterImage!: string;
}
