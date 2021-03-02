export class Place {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public imgUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string
  ) {}
}
