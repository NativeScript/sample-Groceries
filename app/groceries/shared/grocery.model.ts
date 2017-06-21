import { Kinvey } from 'kinvey-nativescript-sdk';
export class Grocery implements Kinvey.Entity {
  constructor(
    public _id: string,
    public name: string,
    public done: boolean,
    public deleted: boolean
  ) {}
}