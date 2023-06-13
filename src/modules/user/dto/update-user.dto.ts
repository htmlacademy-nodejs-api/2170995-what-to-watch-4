import { IsOptional, IsString, Length } from 'class-validator';

export default class UpdateUserDto {
  @IsOptional()
  @IsString({message: 'avatar is required'})
  public avatar?: string;

  @IsOptional()
  @IsString({message: 'name is required'})
  @Length(1, 15, {message: 'Min length is 1, max is 15'})
  public name?: string;
}
