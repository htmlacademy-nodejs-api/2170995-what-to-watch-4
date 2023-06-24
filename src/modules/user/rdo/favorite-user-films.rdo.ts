import { Expose } from 'class-transformer';

export default class FavoriteUserRdo {
  @Expose()
  public email!: string ;

  @Expose()
  public avatar!: string;

  @Expose()
  public name!: string;

  @Expose()
  public favoriteFilms!: string[];
}
