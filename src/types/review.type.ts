import { UserInfo } from './user-info.type';

export type Review = {
  text: string;
  rating: number;
  datePublication: Date;
  user: UserInfo;
}
