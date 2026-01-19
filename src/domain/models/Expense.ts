export class Expense {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly date: string,
    public readonly category: string,
  ) {}
}
