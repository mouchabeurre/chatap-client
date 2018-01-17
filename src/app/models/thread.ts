import { MESSAGE } from './message';

export interface THREAD {
  _id: string;
  room: string;
  title: string;
  feed?: MESSAGE[];
  date: Date;
}