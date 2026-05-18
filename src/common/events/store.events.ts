export class StoreStatusChangedEvent {
  constructor(
    public id: string,
    public name: string,
    public status: string,
    public ownerEmail: string,
    public ownerName: string,
    public timestamp: Date = new Date(),
  ) {}
}
