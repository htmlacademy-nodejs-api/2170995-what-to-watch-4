import CommentDto from '../dto/comment/comment.dto';
import UserDto from '../dto/user/user.dto';
import { Token } from '../types/token';
import { User } from '../types/user';
import { Review } from '../types/review';

export const adaptUserToClient =
  (user: UserDto & {token: Token}): User => ({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatar,
    token: user.token,
  });

export const adaptCommentToClient =
    (comments: CommentDto[]): Review[] => (
      comments.map((comment: CommentDto) => ({
        id: comment.id,
        comment: comment.comment,
        rating: comment.rating,
        date: comment.postDate,
        user: {name: comment.user.name}
      }))
    );
