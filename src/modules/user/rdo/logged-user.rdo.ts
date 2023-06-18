import { Expose } from 'class-transformer';

export default class LoggerUserRdo {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;
}
