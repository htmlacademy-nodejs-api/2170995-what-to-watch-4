import { DocumentType } from '@typegoose/typegoose';
import CreateCommentDto from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';

export interface CommentServiceIntarface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByFilmId(filmId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByFilmId(filmId: string): Promise<number | null>;
}
