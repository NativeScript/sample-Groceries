export class Grocery {
  constructor(
    public id: string,
    public name: string,
    public date: string,
    public done: boolean,
    public deleted: boolean
  ) {}
}