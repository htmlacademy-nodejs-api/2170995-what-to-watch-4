import { Expose } from 'class-transformer';

export default class UserRdo {
  @Expose()
  public id!: string ;

  @Expose()
  public email!: string ;

  @Expose()
  public avatar!: string;

  @Expose()
  public name!: string;
}
