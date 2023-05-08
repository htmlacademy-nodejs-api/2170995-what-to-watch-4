import dayjs from 'dayjs';
import { FilmGeneratorInterface } from './film-generator.interface.js';
import { MockData } from '../../types/mock-data.type.js';
import { generateRandomNumber, getRandomItem, getRandomItems } from '../../core/helpers/index.js';

const MIN_YEAR = 1999;
const MAX_YEAR = 2023;

const MIN_RATING = 0;
const MAX_RATING = 10;

const MIN_MINUTES = 1;
const MAX_MINUTES = 240;

const MIN_COUNT_COMMENTS = 0;
const MAX_COUNT_COMMENTS = 500;

const FIRST_DAY = 1;
const LAST_DAY = 30;

export default class FilmGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const genre = getRandomItem<string>(this.mockData.genres);
    const released = generateRandomNumber(MIN_YEAR, MAX_YEAR).toString();
    const rating = generateRandomNumber(MIN_RATING, MAX_RATING).toString();
    const previewVideoLink = getRandomItem<string>(this.mockData.previewVideoLinks);
    const videoLink = getRandomItem<string>(this.mockData.videoLinks);
    const starring = getRandomItems<string>(this.mockData.starring).join(', ');
    const director = getRandomItem<string>(this.mockData.directors);
    const runTime = generateRandomNumber(MIN_MINUTES, MAX_MINUTES).toString();
    const countComments = generateRandomNumber(MIN_COUNT_COMMENTS, MAX_COUNT_COMMENTS).toString();
    const user = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const posterImage = getRandomItem<string>(this.mockData.posterImages);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImages);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);
    const createdDate = dayjs().subtract(generateRandomNumber(FIRST_DAY, LAST_DAY), 'day').toISOString();

    return [
      title, description, createdDate, genre, released, rating, previewVideoLink,
      videoLink, starring, director, runTime, countComments, user, email, avatar, posterImage,
      backgroundImage, backgroundColor
    ].join('\t');
  }
}
