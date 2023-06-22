export default class CreateFilmDto {
  public name!: string;

  public description!: string;

  public genre!: string[];

  public released!: number;

  public previewVideoLink!: string;

  public videoLink!: string;

  public starring!: string[];

  public director!: string;

  public runTime!: number;

  public backgroundColor!: string;
}
