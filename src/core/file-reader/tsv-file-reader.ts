import { readFileSync } from 'node:fs';

import { FileReaderInterface } from './file-reader.interface';
import { Film } from '../../types/film.type.js';


export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Film[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, createDate, genre, released, rating, previewVideoLink, videoLink, starring, director, runTime, countComments, name, email, avatar, posterImage, backgroundImage, backgroundColor]) => ({
        title,
        description,
        datePublication: new Date(createDate),
        genre,
        released: Number.parseInt(released, 10),
        rating: Number.parseInt(rating, 10),
        previewVideoLink,
        videoLink,
        starring: starring.split(','),
        director,
        runTime: Number.parseInt(runTime, 10),
        countComments: Number.parseInt(countComments, 10),
        user: {name, email, avatar},
        posterImage,
        backgroundImage,
        backgroundColor
      }));
  }
}
